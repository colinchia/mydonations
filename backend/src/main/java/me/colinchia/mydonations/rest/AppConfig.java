package me.colinchia.mydonations.rest;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import me.colinchia.mydonations.util.CorsFilterUtil;
import me.colinchia.mydonations.util.ObjectMapperContextResolverUtil;

import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/api")
public class AppConfig extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        classes.add(DonationRest.class);
        classes.add(CorsFilterUtil.class);
        classes.add(ObjectMapperContextResolverUtil.class);
        return classes;
    }
}
