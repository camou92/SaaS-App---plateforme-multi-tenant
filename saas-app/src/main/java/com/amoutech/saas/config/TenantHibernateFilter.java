package com.amoutech.saas.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

/**
 * Active automatiquement le filtre Hibernate de multi-tenant
 * avant chaque accès aux repositories.
 *
 * <p>
 * Ce composant récupère l'identifiant du tenant courant depuis
 * {@link TenantContext} puis active le filtre Hibernate
 * {@code tenantFilter} afin de limiter les requêtes aux données
 * appartenant uniquement à ce tenant.
 * </p>
 *
 * <p>
 * L'activation est réalisée via un aspect AOP exécuté avant
 * chaque appel à une méthode de repository.
 * </p>
 *
 * <p>
 * Si aucun tenant n'est défini dans le contexte courant,
 * aucun filtre n'est appliqué.
 * </p>
 *
 * @author Mohamed Camara
 * @since 1.0
 */
//@Aspect
//@Component
public class TenantHibernateFilter {

    /**
     * EntityManager utilisé pour accéder à la session Hibernate
     * sous-jacente et activer le filtre de multi-tenance.
     */
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Active le filtre Hibernate {@code tenantFilter} avant chaque
     * exécution d'une méthode de repository.
     *
     * <p>
     * Le paramètre {@code tenantId} injecté dans le filtre est
     * récupéré depuis {@link TenantContext}.
     * </p>
     *
     * <p>
     * Exemple de clause générée :
     * </p>
     *
     * <pre>
     * WHERE tenant_id = ?
     * </pre>
     */
    @Before("execution(* com.amoutech.saas.services.*.*(..))")
    public void activateTenantFilter() {
        final String tenantId = TenantContext.getCurrentTenant();

        if (tenantId != null) {
            final Session session = this.entityManager.unwrap(Session.class);

            // active le filter et injecte le parametre tenantId
            session.enableFilter("tenantFilter")
                    .setParameter("tenantId", tenantId);
        }
    }
}
