package me.colinchia.mydonations.service;

import com.google.gson.Gson;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentConfirmParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.util.*;
import me.colinchia.mydonations.entity.Donation;
import me.colinchia.mydonations.util.SendEmailUtil;
import org.eclipse.microprofile.config.ConfigProvider;

@Stateless
public class DonationService {
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private SendEmailUtil sendEmailUtil;

    private static final Gson gson = new Gson();
    private String frontendUrl;

    @PostConstruct
    private void init() {
        Stripe.apiKey = getConfigValue("STRIPE_SECRET_KEY");
        frontendUrl = getConfigValue("FRONTEND_URL");
    }

    private String getConfigValue(String key) {
        return ConfigProvider.getConfig().getValue(key, String.class);
    }

    public List<Donation> browseAllDonations() {
        return entityManager.createQuery("SELECT d FROM Donation d", Donation.class).getResultList();
    }

    public Map<String, String> processPayment(Donation donation) {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(donation.getDonationAmount().multiply(new BigDecimal(100)).longValue())
                .setCurrency(donation.getDonationCurrency().toLowerCase())
                .setPaymentMethod(donation.getTransactionId())
                .setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.MANUAL)
                .setConfirm(true)
                .setReturnUrl(frontendUrl + "/transaction-result")
                .build();

        return handlePaymentIntent(donation, () -> PaymentIntent.create(params));
    }

    public Map<String, String> finalizePayment(String paymentIntentId) {
        Donation donation = entityManager.createQuery("SELECT d FROM Donation d WHERE d.transactionId = :transactionId", Donation.class)
                .setParameter("transactionId", paymentIntentId)
                .getSingleResult();

        return handlePaymentIntent(donation, () -> {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            if ("requires_confirmation".equals(paymentIntent.getStatus())) {
                PaymentIntentConfirmParams params = PaymentIntentConfirmParams.builder()
                        .setReturnUrl(frontendUrl + "/transaction-result")
                        .build();
                return paymentIntent.confirm(params);
            }
            return paymentIntent;
        });
    }

    private interface PaymentIntentAction {
        PaymentIntent execute() throws Exception;
    }

    private Map<String, String> handlePaymentIntent(Donation donation, PaymentIntentAction action) {
        Map<String, String> result = new HashMap<>();
        try {
            PaymentIntent paymentIntent = action.execute();
            updateDonationBasedOnPaymentIntent(donation, paymentIntent);
            entityManager.persist(donation);
            result.put("status", paymentIntent.getStatus());
            if ("requires_action".equals(paymentIntent.getStatus())) {
                String redirectUrl = paymentIntent.getNextAction().getRedirectToUrl().getUrl();
                result.put("redirectUrl", redirectUrl);
            }
            return result;
        } catch (Exception e) {
            updateDonationForError(donation, e);
            entityManager.persist(donation);
            result.put("status", "error");
            return result;
        }
    }

    private void updateDonationBasedOnPaymentIntent(Donation donation, PaymentIntent paymentIntent) {
        donation.setTransactionId(paymentIntent.getId());
        donation.setTransactionStatus(paymentIntent.getStatus().toUpperCase());
        donation.setResponse(gson.toJson(paymentIntent));
        if ("succeeded".equals(paymentIntent.getStatus())) {
            sendEmailUtil.sendThankYouEmail(donation.getDonorName(), donation.getDonorEmail(), donation.getDonationCurrency(), donation.getDonationAmount());
        }
    }

    private void updateDonationForError(Donation donation, Exception e) {
        String errorJson = e instanceof com.stripe.exception.StripeException ? 
            gson.toJson(((com.stripe.exception.StripeException) e).getStripeError()) : gson.toJson(e.getMessage());
        donation.setTransactionStatus("ERROR");
        donation.setResponse(errorJson);
    }
}
