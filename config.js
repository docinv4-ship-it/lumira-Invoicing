(() => {
  const templatesConfig = {
    1: {
      logoUpload: true,
      fields: [
        "company_name",
        "company_address",
        "company_phone",
        "company_email",
        "invoice_number",
        "invoice_date",
        "due_date",
        "currency",
        "client_name",
        "client_address",
        "client_phone",
        "client_email",
        "client_tax_id",
        "tax_rate",
        "discount",
        "notes",
        "payment_info"
      ],
      itemFields: ["description", "unit_price", "quantity", "line_total"],
      itemType: "array"
    },

    2: {
      fields: [
        "invoice_number",
        "date",
        "due_date",
        "customer_name",
        "customer_address",
        "customer_phone",
        "customer_email",
        "subtotal",
        "shipping",
        "tax_rate",
        "tax_amount",
        "total",
        "bank_details",
        "notes"
      ],
      itemFields: ["description", "unit_price", "qty", "line_total"],
      isSingleItem: false,
      itemType: "html"
    },

    3: {
      logoUpload: true,
      fields: [
        "company_name",
        "company_address",
        "company_phone",
        "company_email",
        "invoice_number",
        "date",
        "order_id",
        "customer_name",
        "customer_phone",
        "customer_email",
        "subtotal",
        "tax_rate",
        "tax_amount",
        "total",
        "payment_method"
      ],
      itemFields: ["description", "unit_price", "qty", "line_total"],
      itemType: "html"
    },

    4: {
      fields: [
        "business_name",
        "business_address",
        "company_phone",
        "company_email",
        "invoice_number",
        "invoice_date",
        "due_date",
        "client_name",
        "client_address",
        "client_phone",
        "client_email",
        "subtotal",
        "tax_rate",
        "grand_total",
        "notes",
        "payment_details"
      ],
      itemFields: ["sku", "description", "qty", "unit_price", "line_total"],
      itemType: "array"
    },

    5: {
      fields: [
        "business_name",
        "business_address",
        "business_phone",
        "business_email",
        "invoice_number",
        "invoice_date",
        "due_date",
        "client_name",
        "client_address",
        "client_phone",
        "client_email",
        "subtotal",
        "tax_rate",
        "grand_total",
        "notes",
        "payment_method",
        "project_code"
      ],
      itemFields: ["description", "qty", "unit_price", "line_total"],
      itemType: "html"
    },

    6: {
      fields: [
        "invoice_number",
        "invoice_date",
        "due_date",
        "currency",
        "client_name",
        "client_address",
        "client_phone",
        "client_email",
        "subtotal",
        "tax_rate",
        "grand_total",
        "payment_method",
        "notes"
      ],
      itemFields: ["description", "qty", "unit_price", "line_total"],
      itemType: "array"
    },

    7: {
      fields: [
        "client_name",
        "client_phone",
        "client_address",
        "client_email",
        "client_tax_id",
        "invoice_number",
        "po_number",
        "invoice_date",
        "due_date",
        "currency",
        "payment_terms",
        "notes",
        "subtotal",
        "tax_rate",
        "tax_amount",
        "discount",
        "grand_total",
        "payment_method"
      ],
      itemFields: ["description", "unit_price", "quantity", "line_total"],
      itemType: "array"
    },

    8: {
      fields: [
        "business_name",
        "client_name",
        "invoice_number",
        "invoice_date",
        "due_date",
        "subtotal",
        "grand_total",
        "business_address",
        "business_phone",
        "business_email",
        "client_address",
        "client_phone",
        "client_email",
        "business_tax_id",
        "client_tax_id",
        "discount",
        "tax_rate",
        "tax_amount",
        "payment_terms",
        "notes"
      ],
      itemFields: ["item_description", "quantity", "unit_price", "line_total"],
      itemType: "array"
    },

    9: {
      logoUpload: true,
      fields: [
        "business_name",
        "business_address",
        "business_phone",
        "business_email",
        "invoice_number",
        "invoice_date",
        "due_date",
         "currency",
        "client_name",
        "client_address",
        "client_email",
        "subtotal",
        "tax_rate",
         "discount",
        "tax_amount",
        "grand_total",
        "payment_terms",
        "thank_you_text"
      ],
      itemFields: ["description", "qty", "unit_price", "line_total"],
      itemType: "svg"
    },

    10: {
      logoUpload: true,
      fields: [
        "customer_name",
        "customer_address",
        "customer_phone",
        "customer_email",
        "invoice_number",
        "date",
        "due_date",
        "reference_number",
        "currency",
        "notes",
        "bank_details",
        "terms"
      ],
      itemFields: [
        "sku",
        "description",
        "qty",
        "unit_price",
        "discount",
        "tax_rate",
        "line_total"
      ],
      itemType: "html"
    },

    11: {
      logoUpload: true,
      fields: [
        "business_name",
        "business_address",
        "business_phone",
        "business_email",
        "invoice_number",
        "invoice_date",
        "client_name",
        "client_address",
        "client_phone",
        "subtotal",
        "tax_rate",
        "tax_amount",
        "grand_total",
        "notes"
      ],
      itemFields: ["description", "qty", "unit_price", "line_total"],
      itemType: "svg"
    }
  };

  const masterFields = {
    company_name: { label: "Company Name", type: "text", placeholder: "Enter company name" },
    company_address: { label: "Company Address", type: "textarea", placeholder: "Enter company address" },
    company_phone: { label: "Company Phone", type: "text", placeholder: "Enter company phone" },
    company_email: { label: "Company Email", type: "text", placeholder: "Enter company email" },

    business_name: { label: "Business Name", type: "text", placeholder: "Enter business name" },
    business_address: { label: "Business Address", type: "textarea", placeholder: "Enter business address" },
    business_phone: { label: "Business Phone", type: "text", placeholder: "Enter business phone" },
    business_email: { label: "Business Email", type: "text", placeholder: "Enter business email" },
    business_tax_id: { label: "Business Tax ID", type: "text", placeholder: "Enter business tax ID" },

    client_name: { label: "Client Name", type: "text", placeholder: "Enter client name" },
    client_address: { label: "Client Address", type: "textarea", placeholder: "Enter client address" },
    client_phone: { label: "Client Phone", type: "text", placeholder: "Enter client phone" },
    client_email: { label: "Client Email", type: "text", placeholder: "Enter client email" },
    client_tax_id: { label: "Client Tax ID", type: "text", placeholder: "Enter client tax ID" },

    customer_name: { label: "Customer Name", type: "text", placeholder: "Enter customer name" },
    customer_address: { label: "Customer Address", type: "textarea", placeholder: "Enter customer address" },
    customer_phone: { label: "Customer Phone", type: "text", placeholder: "Enter customer phone" },
    customer_email: { label: "Customer Email", type: "text", placeholder: "Enter customer email" },

    invoice_number: { label: "Invoice Number", type: "text", placeholder: "Enter invoice number" },
    invoice_date: { label: "Invoice Date", type: "date", placeholder: "" },
    date: { label: "Date", type: "date", placeholder: "" },
    due_date: { label: "Due Date", type: "date", placeholder: "" },
    order_id: { label: "Order ID", type: "text", placeholder: "Enter order ID" },
    po_number: { label: "PO Number", type: "text", placeholder: "Enter PO number" },
    reference_number: { label: "Reference Number", type: "text", placeholder: "Enter reference number" },
    currency: { label: "Currency", type: "text", placeholder: "USD" },

    payment_method: { label: "Payment Method", type: "text", placeholder: "Enter payment method" },
    payment_terms: { label: "Payment Terms", type: "textarea", placeholder: "Enter payment terms" },
    terms: { label: "Terms", type: "textarea", placeholder: "Enter terms" },
    notes: { label: "Notes", type: "textarea", placeholder: "Enter notes" },
    payment_info: { label: "Payment Info", type: "textarea", placeholder: "Enter payment info" },
    payment_details: { label: "Payment Details", type: "textarea", placeholder: "Enter payment details" },
    bank_details: { label: "Bank Details", type: "textarea", placeholder: "Enter bank details" },
    bank_name: { label: "Bank Name", type: "text", placeholder: "Enter bank name" },
    bank_account: { label: "Bank Account", type: "text", placeholder: "Enter bank account" },
    bank_routing: { label: "Bank Routing", type: "text", placeholder: "Enter bank routing" },
    account_number: { label: "Account Number", type: "text", placeholder: "Enter account number" },

    project_code: { label: "Project Code", type: "text", placeholder: "Enter project code" },
    thank_you_text: { label: "Thank You Text", type: "textarea", placeholder: "Enter thank you text" },

    subtotal: { label: "Subtotal", type: "text", readonly: true, placeholder: "Auto calculated" },
    shipping: { label: "Shipping", type: "number", step: "0.01", min: "0", placeholder: "0.00" },
    tax_rate: { label: "Tax Rate (%)", type: "number", step: "0.01", min: "0", placeholder: "0" },
    tax_amount: { label: "Tax Amount", type: "text", readonly: true, placeholder: "Auto calculated" },
    discount: { label: "Discount", type: "number", step: "0.01", min: "0", placeholder: "0.00" },
    total: { label: "Total", type: "text", readonly: true, placeholder: "Auto calculated" },
    grand_total: { label: "Grand Total", type: "text", readonly: true, placeholder: "Auto calculated" }
  };

  const itemMaster = {
    description: { label: "Description", type: "text", placeholder: "Item description" },
    item_description: { label: "Item Description", type: "text", placeholder: "Item description" },
    sku: { label: "SKU", type: "text", placeholder: "SKU" },
    qty: { label: "Qty", type: "number", min: "0", step: "1", placeholder: "0" },
    quantity: { label: "Quantity", type: "number", min: "0", step: "1", placeholder: "0" },
    unit_price: { label: "Unit Price", type: "number", min: "0", step: "0.01", placeholder: "0.00" },
    discount: { label: "Discount", type: "number", min: "0", step: "0.01", placeholder: "0.00" },
    tax_rate: { label: "Tax Rate (%)", type: "number", min: "0", step: "0.01", placeholder: "0" },
    line_total: { label: "Line Total", type: "text", readonly: true, placeholder: "Auto calculated" }
  };

  window.templatesConfig = templatesConfig;
  window.masterFields = masterFields;
  window.itemMaster = itemMaster;
})();