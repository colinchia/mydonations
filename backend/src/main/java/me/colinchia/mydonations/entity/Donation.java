package me.colinchia.mydonations.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "donor_name")
    private String donorName;

    @Column(name = "donor_email")
    private String donorEmail;

    @Column(name = "donor_comments")
    private String donorComments;

    @Column(name = "donation_currency")
    private String donationCurrency;

    @Column(name = "donation_amount")
    private BigDecimal donationAmount;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "transaction_mode")
    private String transactionMode;

    @Column(name = "transaction_status")
    private String transactionStatus;

    @Column(name = "request")
    private String request;

    @Column(name = "response")
    private String response;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;


    /**
     * Constructors
     */
    public Donation() {

    }

    public Donation(String donorName, String donorEmail, String donorComments, String donationCurrency, BigDecimal donationAmount, String transactionId, String transactionMode, String transactionStatus, String request, String response) {
        this.donorName = donorName;
        this.donorEmail = donorEmail;
        this.donorComments = donorComments;
        this.donationCurrency = donationCurrency;
        this.donationAmount = donationAmount;
        this.transactionId = transactionId;
        this.transactionMode = transactionMode;
        this.transactionStatus = transactionStatus;
        this.request = request;
        this.response = response;
    }


    /**
     * Getters and setters
     */
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getDonorEmail() {
        return donorEmail;
    }

    public void setDonorEmail(String donorEmail) {
        this.donorEmail = donorEmail;
    }

    public String getDonorComments() {
        return donorComments;
    }

    public void setDonorComments(String donorComments) {
        this.donorComments = donorComments;
    }

    public String getDonationCurrency() {
        return donationCurrency;
    }

    public void setDonationCurrency(String donationCurrency) {
        this.donationCurrency = donationCurrency;
    }

    public BigDecimal getDonationAmount() {
        return donationAmount;
    }

    public void setDonationAmount(BigDecimal donationAmount) {
        this.donationAmount = donationAmount;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getTransactionMode() {
        return transactionMode;
    }

    public void setTransactionMode(String transactionMode) {
        this.transactionMode = transactionMode;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public String getRequest() {
        return request;
    }

    public void setRequest(String request) {
        this.request = request;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    /**
     * toString
     */
    @Override
    public String toString() {
        return "Donation{" +
                "id=" + id +
                ", donorName='" + donorName + '\'' +
                ", donorEmail='" + donorEmail + '\'' +
                ", donorComments='" + donorComments + '\'' +
                ", donationCurrency='" + donationCurrency + '\'' +
                ", donationAmount=" + donationAmount +
                ", transactionId='" + transactionId + '\'' +
                ", transactionMode='" + transactionMode + '\'' +
                ", transactionStatus='" + transactionStatus + '\'' +
                ", request='" + request + '\'' +
                ", response='" + response + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
