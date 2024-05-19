package me.colinchia.mydonations.util;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Stateless;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.util.Properties;
import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;

@Stateless
public class SendEmailUtil {
    private Session session;
    private String emailFrom;

    @PostConstruct
    public void init() {
        final String username = getConfigValue("MAIL_USERNAME");
        final String password = getConfigValue("MAIL_PASSWORD");

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", getConfigValue("MAIL_HOST"));
        props.put("mail.smtp.port", getConfigValue("MAIL_PORT"));

        this.session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        final String emailFrom = getConfigValue("MAIL_FROM");
        this.emailFrom = getConfigValue(emailFrom, username);
    }

    private String getConfigValue(String key) {
        Config config = ConfigProvider.getConfig();
        return config.getOptionalValue(key, String.class).orElse(null);
    }

    private String getConfigValue(String key, String defaultValue) {
        Config config = ConfigProvider.getConfig();
        return config.getOptionalValue(key, String.class).orElse(defaultValue);
    }

    public void sendEmail(String emailTo, String emailSubject, String emailBody) {
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(emailFrom));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailTo));
            message.setSubject(emailSubject);
            message.setContent(emailBody, "text/html; charset=utf-8");

            Transport.send(message);
            System.out.println("Email sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendThankYouEmail(String donorName, String donorEmail, String donationCurrency, BigDecimal donationAmount) {
        String emailSubject = "Thank You for Your Support!";
        String emailBody = String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>The Green Mars Project: Thank You for Your Support!</title>
                <meta charset="utf-8">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap">
                <style>
                    * {
                        font-family: 'Open Sans', sans-serif;
                    }
                </style>
            </head>
            <body>
                <div>
                    <p>Dear %s,</p>
                    <p>Thank you for your generous donation of %s %s.<br/>Your support is greatly appreciated!</p>
                    <p>Best regards,<br/>The Green Mars Project Team</p>
                </div>
            </body>
            """, donorName, donationAmount, donationCurrency);

        sendEmail(donorEmail, emailSubject, emailBody);
    }
}
