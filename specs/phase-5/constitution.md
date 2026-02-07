# Phase 5 Project Constitution

## Principles

1. **Backward Compatibility** - Phase 4 functionality must never break
2. **Additive Design** - All new code is additive, not destructive
3. **Infrastructure Isolation** - Phase 5 infra lives in dedicated directories
4. **Feature Toggleability** - Phase 5 can be enabled/disabled via environment
5. **Dapr-First Communication** - Services communicate only through Dapr, never direct Kafka clients
6. **Cloud-Native** - All services are containerized and Kubernetes-ready
7. **Non-Blocking Events** - Event failures never cascade to user-facing operations
8. **Spec-Driven Development** - Design before implementation, document decisions
