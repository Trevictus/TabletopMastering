# Phase 2.2f): Budget and Economic Valuation

## 1. Cost by Profile
An hourly rate has been established based on the Junior Fullstack profile, aligned with the strategy of keeping development costs low to compete on price.

| Profile | Developer | Cost/Hour |
| :--- | :--- | :---: |
| Junior Fullstack | @Aaranaa00 (Manuel) | €20 |
| Junior Fullstack | @Trevictus (Victor) | €20 |
| Junior Fullstack | @Juanfu224 (Juan) | €20 |

## 2. Tracking and Deviations (Sprint-by-Sprint Detail)
Comparison between the estimate and actual hours charged.

| Sprint | Dev | Est. H. | Real H. | Real Cost | Deviation Analysis |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Sprint 1** | Victor | 18 | 12 | €240 | Overestimated. Wireframes and palette took less time than expected. |
| | Manuel | 8 | 10 | €200 | Includes reviews and initial tests not contemplated in tickets. |
| | Juan | 10 | 8 | €160 | Environment setup and initial repo was smooth. |
| **Sprint 2** | Victor | 15 | 13 | €260 | Accurate. Errors in React setup compensated with quick tasks. |
| | Manuel | 7 | 11 | €220 | Authentication incidents required extra support. |
| | Juan | 8 | 9 | €180 | Database required minor schema redesign. |
| **Sprint 3** | Victor | 12 | 15 | €300 | Lack of theoretical foundation in authentication context. |
| | Manuel | 8 | 12 | €240 | API integration and ranking logic more complex than expected. |
| | Juan | 10 | 12 | €240 | Backend logic support and merge conflict resolution. |
| **Sprint 4** | Victor | 14 | 10 | €200 | Calendar implementation quick, with minor UX corrections. |
| | Manuel | 7 | 9 | €180 | User validations required additional corrections. |
| | Juan | 8 | 7 | €140 | Seeder and test data creation was efficient. |
| **Sprint 5** | Victor | 15 | 10 | €200 | Market research extended, but development agile. |
| | Manuel | 6 | 8 | €160 | Refactoring and DevOps tasks (analysis/debugging) not counted. |
| | Juan | 8 | 10 | €200 | Integration testing detected failures requiring fixes. |
| **Sprint 6** | Victor | 12 | 13 | €260 | Final documentation required deep review of writing. |
| | Manuel | 7 | 10 | €200 | Project closure, code cleanup, and final support. |
| | Juan | 6 | 6 | €120 | Technical documentation and final deployment. |

---

## 3. Project Total Costs
Upon completion of implementation, the final economic breakdown is as follows:

### 3.1 Summary of Development Hours
* **Victor:** 73 total hours.
* **Manuel:** 60 total hours.
* **Juan:** 52 total hours.
* **Total Hours:** 185 hours.

### 3.2 Final Budget Table

| Concept | Detail | Total Cost |
| :--- | :--- | :---: |
| **Human Resources** | Software Development (185h x €20/h) | **€3,700.00** |
| **Infrastructure** | DigitalOcean Droplet (€12/month x 2 months dev) | €24.00 |
| **Domains** | Name.com (Annual registration prorated to usage) | €3.25 |
| **Tools** | GitHub Copilot (2 licenses x 2 months - *Estimated*) | €40.00 |
| **Contingency** | Safety margin (5% on direct costs) | €188.36 |
| **TOTAL PROJECT** | **Total investment made** | **€3,955.61** |

---

## 4. Product Market Valuation

### 4.1 Pricing Strategy (Consistency with Phase 1.1a Analysis)
The competitor analysis (*BG Stats, ScorePal*) revealed a fragmented market where users pay for the base app and then pay extra for features. This creates friction.

Our value proposition is the **"All-Inclusive"** model.
* **Competition:** BG Stats costs ~$13 USD for the complete experience.
* **Our Strategy:** Compete on price and simplicity.

### 4.2 Proposed Price
An **All-in-One Payment** model is established for platform usage.
* **Sale Price:** **€9.99**.
* *Justification:* It sits in the psychological "less than €10" range identified in the analysis as "very attractive", removing resistance to monthly subscriptions that exists in this hobby niche.

---

## 5. Return on Investment (ROI)
**Investment to recover:** ~€3,956
**Net income per unit sold:** ~€9.50 after payment processing discounts.
**Break-Even Point:** Need to sell approximately **~417 licenses** to recover the investment.

Three scenarios are proposed based on unit sales:

### Scenario A: Optimistic (Viral on Social/BGG)
* **Assumption:** Successful launch on BoardGameGeek forums and Reddit. Sales of 60 licenses/month.
* **Result:** Investment recovered in **7 months**.
* *Feasibility:* High short-term profitability.

### Scenario B: Realistic (Niche Growth)
* **Assumption:** Moderate initial sales (family/friends) and slow growth. Average 25 licenses/month.
* **Result:** Break-even reached in **month 17 (1.5 years)**.
* *Feasibility:* Acceptable for a side project, although server maintenance must be low.

### Scenario C: Pessimistic (Market Saturation)
* **Assumption:** Market prefers BG Stats. Residual sales of 5 licenses/month.
* **Result:** Would take **6+ years** to recover the investment.
* *Feasibility:* Project would generate losses because recurring server costs (annual hosting) would exceed income.

---

## 6. Lessons Learned on Economic Management

1.  **Impact of Business Model on Architecture:**
    * By choosing a *One-Time Payment* model (suggested by market analysis) instead of *Subscription*, we faced the challenge of maintaining server costs (Recurring) with one-time income.
    * *Lesson:* For future projects with this model, we should consider *Serverless* architectures (AWS Lambda/Firebase) that scale to zero cost if unused, rather than fixed VPS (DigitalOcean).

2.  **Technical Deviations:**
    * The largest economic deviation (Sprint 3) came from underestimating the complexity of business logic (Backend).
    * *Improvement:* Conduct "Spikes" (brief technical investigations) before estimating complex user stories in Planning Poker.

3.  **Cost of "Visual Quality":**
    * The focus on "Images to Share" (identified competitive advantage) consumed more frontend hours than estimated in Sprints 4 and 5. Visual differentiation is expensive to develop.

4.  **Final Conclusion:**
    * The project is economically viable (~€4,000 cost) only if we position ourselves as the "modern and cheap" alternative to BG Stats. Controlling development costs has been key to allowing us to enter the market with an aggressive €9.99 price.
