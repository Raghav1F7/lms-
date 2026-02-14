# 8-Phase Engineering Lifecycle

Mantra :philosphy: Build less, creates amximum positive difference(simple>compelxity ) true problem solving 

no complexityin execution--no overthinking keepingthings simple and easy (no rabit holes)

When this skill is activated, you MUST follow these phases in order.
You cannot skip a phase without explicit justification.

## 🎨 DESIGN MODE (No Code Written)(ouput: create or append/update or veirfy the :@<#>project.specs.md exists)

### Phase 0 — Clarify Intent + understand the UI design --the screens or prototype 
Before writing any code, confirm:
1.  **What problem are we solving?**
2.  **Who is the end user?**
3.  **What is the domain trust requirement?** 
4.*** what's the main actual screen or prototpye(any deisgn or protype files exist)(e.g., financial data needs high trust, logs need low,) and the ui beahviour or exact ui protoype exists).?
5) verify any new technolgy or optonal we have to use (eg even docker kubernets or any thing that prejct demands)

**⛔ STOP**: Do not proceed until intent is clear and agreed upon(and a clear proejct.specs.md exists(req res-shape,Business rules, UI(protype or frontend reference or UI protype screens/flow beahviour is there).

### Phase 1 — Contract Definition
Define the API shape and behavior:
1.  **Request/Response shapes:** What goes in, what comes out.
2.  **Error semantics:** How do we signal failure?
3.  **Deterministic behaviors:** Given X, always Y.

**⛔ STOP**: Do not proceed until the contract is defined.

### Phase 2 — Business Rules
Define the constraints:
1.  **Identity rules:** What makes an entity unique?
2.  **Data invariants:** What must always be true?
3.  **Deletion rules:** Can this be deleted? (Soft delete vs Hard delete).
4.  **Derived field policy:** How is data calculated?

**⛔ STOP**: Do not proceed until business rules are locked.

---

## 🤖 MULTI-AGENT COLLABORATION STRATEGY
The Orchestrator initiates the project and splits the WORKLOAD.

| Agent Role | Responsibility | Handoff Trigger |
| :--- | :--- | :--- |
| **Orchestrator** | Phase 0-2: Design & Contract | Phase 1 Lock |
| **Domain Agent** | Phase 3-4: DB & Services | Phase 4 Test Green |
| **Interface Agent** | Phase 5: Hotwire & Views | Phase 5 Visual Match |
| **Quality Agent** | Phase 6-7: RSpec & CI | Phase 7 Gate Pass |

---

## 🏗️ IMPLEMENTATION MODE (Multi-Agent Execution)

### Phase 3 — Database Enforcement
Translate business rules into schema:
1.  **Unique constraints:** Enforce uniqueness at the DB level.
2.  **NOT NULL constraints:** Enforce presence at the DB level.
3.  **Foreign keys:** Enforce relationships at the DB level.
4.  **Index strategy:** Optimize for read patterns.

**⛔ STOP**: Do not proceed to domain logic until schema is migrated and verified.

### Phase 4 — Domain Layer
Build the core logic:
1.  **Models:** Represent data and relationships.
2.  **Service objects:** Encapsulate business logic.
3.  **Transaction boundaries:** Ensure atomicity.

**⛔ STOP**: Do not proceed to interface until domain logic is tested (unit tests).

### Phase 5 — Interface Layer
Connect the domain to the world:
1.  **Controllers:** Handle HTTP requests (thin).
2.  **Views/Serializers:** Present data deterministically.
3.  **State handling:** Manage session/context.

**⛔ STOP**: Do not proceed until interface is wired and basic integration tests pass.

### Phase 6 — Testing
Validate the system:
1.  **Unit tests:** Test models and services in isolation.
2.  **Integration tests:** Test the flow across layers.
3.  **Edge cases:** Test boundaries and error conditions.
4.  **Domain rule validation:** Verify invariants are enforced.

**⛔ STOP**: Do not proceed until coverage meets standards.

## Phase 7 — CI/CD Gate
Ensure deployment readiness:
1.  **Automated tests:** Must pass green.
2.  **Linting:** Code must be clean and standardized.
3.  **Migration validation:** Migrations must be reversible and safe.
4.  **Deployment readiness:** Artifacts are built and tagged.

## Phase 8 — Stop Condition
Check before closing ticket:
1.  **No scope creep:** Only requested features are built.
2.  **No "future improvements":** Current work is complete.
3.  **Release-ready:** Code is merged and deployable.
