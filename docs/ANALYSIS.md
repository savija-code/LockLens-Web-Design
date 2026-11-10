# Password analysis and generation provenance

## Independent analysis components

1. **Estimated guess resistance:** `@zxcvbn-ts/core` 4.2.0, common dictionaries 4.1.3 and English dictionaries/translations 4.1.1, including common keyboard graphs. The same estimator and default scoring thresholds apply to generated and entered text. We display its 0–4 score as Very weak, Weak, Moderate, Good or Strong. We do not add category bonuses, length penalties, or provenance bonuses. Recognized pattern descriptions and estimator feedback provide context. A recognized fragment does not necessarily make the complete password weak; the estimator considers the complete guessing strategy.
2. **Character composition:** actual code-point length, counts and category presence derived only from the password text. Unicode uppercase and titlecase letters count as uppercase, lowercase letters as lowercase, and Unicode numbers as numbers. The fourth bucket, “Symbols / other,” includes punctuation, spaces, emoji, combining marks and uncased letters. Each code point belongs to exactly one bucket. This is a descriptive classification, not a grade, normalization step or proof of randomness. Pool size is never inferred from entered text.
3. **Length guidance:** Unicode code-point count and a separate brief NIST verifier advisory. This never changes the estimate.
4. **Generation provenance:** only immutable batches returned by `generateBatch` in this runtime are registered in a private WeakSet. Their frozen options and password list preserve the configuration that produced them. Copies, fabricated records and text typed or pasted into Analyzer have unknown generation provenance, even if they look random or match a generated password. This is an internal association, not an attestation against malicious scripts or a compromised browser.

The horizontal meter shows the estimator score, with warnings and detected patterns as context. A score of 4/4 is the highest band; passwords within that band can have different modeled guess counts. Conditional generation mathematics stay under “Generation details.” No password or matched token is returned in our analysis result. Raw estimator results remain temporary local variables.

## Generation probability model

The generator samples one uniformly random character from each enabled, filtered, disjoint category, fills the remaining positions uniformly from the combined alphabet, and applies an unbiased Fisher–Yates shuffle. Rejection sampling removes modulo bias. We model Web Crypto draws as independent uniform draws. The category guarantees make complete outputs non-uniform: `length × log2(alphabet size)` is not the exact entropy of this algorithm.

Let:

- `L` be length, `k` the number of categories, `s_i` each filtered category size, and `S = sum(s_i)`.
- `n_i` be the number of characters from category `i` in a particular output `w`.
- `(L)_k = L × (L−1) × … × (L−k+1)`.

For every output containing each category:

```text
P(w) = product(n_i) / ((L)_k × product(s_i) × S^(L−k))
```

The shuffle puts the `k` labelled mandatory picks into an ordered tuple of distinct positions, each with probability `1/(L)_k`. There are `product(n_i)` compatible choices of those positions. Their characters have probability `1/product(s_i)`; the remaining specified characters have probability `S^−(L−k)`.

For fixed `sum(n_i) = L`, the product is largest when counts are as balanced as possible. With `q = floor(L/k)` and `r = L mod k`:

```text
max P(w) = q^(k−r) × (q+1)^r / ((L)_k × product(s_i) × S^(L−k))
H_min = −log2(max P(w))
```

The UI rounds this min-entropy down (with a small rounding margin). It is a conservative per-output probability bound under the stated model, not an exact Shannon entropy, expected number of guesses, crack-time estimate or guarantee about a particular password. An attacker allowed `g` distinct guesses has success probability at most `min(1, g × max P(w))` under that model. No process bound overrides a low pattern score for a coincidentally predictable output. For a single category, the result reduces to `L × log2(S)`.

Tests verify this reduction, non-uniform category coverage, and probability normalization/maxima by independently enumerating category-count outcomes. Any future change to category overlap, filling or shuffling must update this derivation and its tests.

## NIST reference and limits

[NIST SP 800-63B-4, §3.1.1.2 Password Verifiers](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver) requires conforming verifiers and credential service providers to require at least 15 characters for passwords used as a single authentication factor. For passwords used within MFA, the publication permits a minimum of eight. These are verifier requirements in the standard's context, not universal mathematical strength thresholds. LockLens is a generator/analyzer, not an authentication verifier or a NIST compliance assessment. A long repeated string can meet the length requirement and still be easy to guess.

[zxcvbn-ts installation and output](https://zxcvbn-ts.github.io/zxcvbn/guide/getting-started/) and [configuration](https://zxcvbn-ts.github.io/zxcvbn/guide/options/) describe the estimator, recommended dictionaries and default score model. Its score is approximate and depends on its dictionaries and attacker model. We do not display its attack-time forecasts. English/common dictionaries do not model every language, personal context, attacker strategy or breach dataset. No breach lookup is performed.

Input analysis is limited to 256 UTF-16 code units, matching the local estimator's configured limit. Longer inputs in both the UI and the core are explicitly not assessed, rather than silently truncated and rated. Length guidance counts code points, so emoji may use two input-limit units but count as one character. The UI explains this distinction briefly. Long or adversarial supported inputs can still take time on slower devices. Crypto correctness, browser/device integrity, password reuse, phishing and a service's hashing/rate limits remain outside this assessment.

## Local assets, licensing and verification

esbuild bundles the app, estimator and dictionaries into a same-origin static asset. The measured bundle is approximately 1,657 KiB (829 KiB gzip); the host must enable gzip to obtain that transfer size. No lazy network dictionaries, pwned-password matcher, telemetry or remote API is configured. Loading site files requests them from the host; generation and analysis make no additional requests. The host may have ordinary access logs. Passwords and inputs are never placed in those requests.

LockLens source code uses the root [MIT License](../LICENSE). Third-party estimator code and supporting packages retain their own licenses and copyrights. English dictionary data also includes OpenSubtitles-derived ODC-BY attribution. The source repository retains these texts in [THIRD_PARTY_NOTICES.txt](../THIRD_PARTY_NOTICES.txt); the build also writes a distribution copy under `dist/`.

`npm.cmd run check`, `npm.cmd run build` and `npm.cmd test` validate the implementation. Browser tests use `playwright-core` with an already installed Chromium browser; no browser is downloaded. Regression coverage includes the requested lengths, category and exclusion combinations, malformed options, unavailable crypto, unbiased selection/shuffling, immutable metadata, real-estimator parity, repeated/common patterns, independent length guidance, navigation, clipboard masking, no analysis requests/storage writes and layout widths 320/390/768/1024/1440. These tests are not an independent security audit or a complete browser/screen-reader compatibility audit.


The temporary core result exposes the estimator warning and unchanged log-base-ten guess count for regression checks. Unassessed inputs have no guess estimate. These aggregates contain no password values or matched tokens and do not add category bonuses, length-policy penalties or a numeric crack-time display. Tests compare the real estimator output and relative guess-count ordering rather than forcing fixed scores.
