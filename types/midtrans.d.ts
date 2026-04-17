declare module 'midtrans-client' {
  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }

  interface Callbacks {
    finish?: string;
    error?: string;
    pending?: string;
  }

  interface TransactionParameter {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    callbacks?: Callbacks;
    enabled_payments?: string[];
    custom_field1?: string;
    custom_field2?: string;
    custom_field3?: string;
  }

  interface TransactionResult {
    token: string;
    redirect_url: string;
  }

  interface TransactionAPI {
    refund(orderId: string, parameter?: Record<string, unknown>): Promise<unknown>;
    status(orderId: string): Promise<Record<string, unknown>>;
    cancel(orderId: string): Promise<unknown>;
  }

  class Snap {
    constructor(options: SnapOptions);
    transaction: TransactionAPI;
    createTransaction(parameter: TransactionParameter): Promise<TransactionResult>;
  }

  export = { Snap };
}

interface Window {
  snap?: {
    pay(
      token: string,
      options?: {
        onSuccess?: (result: Record<string, unknown>) => void;
        onPending?: (result: Record<string, unknown>) => void;
        onError?: (result: Record<string, unknown>) => void;
        onClose?: () => void;
      }
    ): void;
  };
}
