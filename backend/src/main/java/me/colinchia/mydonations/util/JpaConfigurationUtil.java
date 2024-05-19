package me.colinchia.mydonations.util;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.ws.rs.Produces;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class JpaConfigurationUtil {
    @ConfigProperty(name = "DATASOURCE_URL")
    String datasourceUrl;

    @ConfigProperty(name = "DATASOURCE_USERNAME")
    String datasourceUsername;

    @ConfigProperty(name = "DATASOURCE_PASSWORD")
    String datasourcePassword;

    @Produces
    public EntityManagerFactory createEntityManagerFactor() {
        Map<String, String> properties = new HashMap<>();
        properties.put("jakarta.persistence.jdbc.url", datasourceUrl);
        properties.put("jakarta.persistence.jdbc.user", datasourceUsername);
        properties.put("jakarta.persistence.jdbc.password", datasourcePassword);

        return Persistence.createEntityManagerFactory("default", properties);
    }
}
