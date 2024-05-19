package me.colinchia.mydonations.rest;

import java.util.Collections;
import java.util.Map;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import me.colinchia.mydonations.entity.Donation;
import me.colinchia.mydonations.service.DonationService;

@Path("/donations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DonationRest {
    @Inject
    private DonationService donationService;

    @GET
    public Response browseAllDonations() {
        try {
            return Response.ok(donationService.browseAllDonations()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("error", "Failed to fetch donations")).build();
        }
    }

    @POST
    public Response addDonation(Donation donation) {
        Map<String, String> paymentResult = donationService.processPayment(donation);
        switch (paymentResult.get("status")) {
            case "succeeded":
                return Response.ok(donation).build();
            case "requires_action":
                return Response.status(Response.Status.OK).entity(paymentResult).build();
            case "error":
                return Response.status(Response.Status.BAD_REQUEST).entity(Collections.singletonMap("error", "Payment processing failed")).build();
            default:
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("error", "Unexpected error occurred")).build();
        }
    }

    @GET
    @Path("/finalize-payment/{paymentIntentId}")
    public Response finalizePayment(@PathParam("paymentIntentId") String paymentIntentId) {
        Map<String, String> paymentResult = donationService.finalizePayment(paymentIntentId);
        if ("succeeded".equals(paymentResult.get("status")) || "requires_action".equals(paymentResult.get("status"))) {
            return Response.ok(paymentResult).build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("error", "Error finalizing payment")).build();
        }
    }

    @GET
    @Path("/check-health")
    public Response checkHealth() {
        return Response.ok("The MyDonations backend app is up and running!").build();
    }
}
