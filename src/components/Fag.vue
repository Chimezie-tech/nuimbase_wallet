<template>
  <div class="d-flex justify-content-center align-items-center">
  <div
    class="container m-4 "
    style="
      border-bottom: 1px solid #094D72;
      border-left: 0;
      border-right: 0;
      padding-top: 30px;
      padding-bottom: 10px;
    "
  >
    <div style="text-align: center; font-family: Poppins; color: #29974D;">
      <h2>FAQ</h2>
    </div>

    <div class="accordion accordion-flush" id="accordionFlushExample">

      <!-- FAQ 1 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseOne"
            aria-expanded="false"
            aria-controls="flush-collapseOne"
            style="font-family: Nunito; font-size: 14px;"
          >
            What legal services do you offer?
          </button>
        </h2>
        <div
          id="flush-collapseOne"
          class="accordion-collapse collapse"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body" style="font-family: Nunito; font-size: 14px;">
            We offer legal services such as criminal defense, family law, property disputes,
            business/commercial matters, and consultation sessions. Every case is handled
            professionally with personalized attention.
          </div>
        </div>
      </div>

      <!-- FAQ 2 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseTwo"
            aria-expanded="false"
            aria-controls="flush-collapseTwo"
            style="font-family: Nunito; font-size: 14px;"
          >
            How do I book a consultation?
          </button>
        </h2>
        <div
          id="flush-collapseTwo"
          class="accordion-collapse collapse"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body" style="font-family: Nunito; font-size: 14px;">
            You can book a consultation through the “Call Now” button, by filling out the
            contact form, or by reaching out through WhatsApp. Confirmation will be provided
            with date and time details.
          </div>
        </div>
      </div>

      <!-- FAQ 3 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseThree"
            aria-expanded="false"
            aria-controls="flush-collapseThree"
            style="font-family: Nunito; font-size: 14px;"
          >
            How much do your legal services cost?
          </button>
        </h2>
        <div
          id="flush-collapseThree"
          class="accordion-collapse collapse"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body" style="font-family: Nunito; font-size: 14px;">
            Costs vary depending on the case type and complexity. Consultation fees differ
            from litigation and specialized services. A transparent cost breakdown will be
            provided before proceeding.
          </div>
        </div>
      </div>

      <!-- FAQ 4 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseFour"
            aria-expanded="false"
            aria-controls="flush-collapseFour"
            style="font-family: Nunito; font-size: 14px;"
          >
            How long does it take to resolve a legal case?
          </button>
        </h2>
        <div
          id="flush-collapseFour"
          class="accordion-collapse collapse"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body" style="font-family: Nunito; font-size: 14px;">
            Case duration depends on court processes, evidence review, negotiations, and
            other legal procedures. Some matters conclude in weeks, while others extend for
            months. Regular updates will be provided.
          </div>
        </div>
      </div>

      <!-- FAQ 5 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseFive"
            aria-expanded="false"
            aria-controls="flush-collapseFive"
            style="font-family: Nunito; font-size: 14px;"
          >
            Do you handle emergency legal matters?
          </button>
        </h2>
        <div
          id="flush-collapseFive"
          class="accordion-collapse collapse"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body" style="font-family: Nunito; font-size: 14px;">
            Yes. For emergencies such as arrests and urgent police-related issues, you can
            call the emergency line provided on the website for immediate assistance.
          </div>
        </div>
      </div>

    </div>
  </div>
  </div>
</template>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: #E8F7ED !important;
  color: #29974D !important;
  box-shadow: none !important;
  border-top: 1px solid #29974D !important;
  border-bottom: 0.1px solid #29974D !important;
}

.accordion-button:focus {
  box-shadow: none !important;
}
</style>
