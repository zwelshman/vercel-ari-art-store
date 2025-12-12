// Print-on-demand service using Printful API

const PRINTFUL_API_URL = "https://api.printful.com";

interface PrintfulProduct {
  id: number;
  type: string;
  type_name: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
}

interface PrintfulVariant {
  id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  price: string;
  in_stock: boolean;
}

interface PrintOrder {
  recipient: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    email?: string;
    phone?: string;
  };
  items: {
    variant_id: number;
    quantity: number;
    files: {
      url: string;
      type: string;
    }[];
  }[];
}

interface ShippingRate {
  id: string;
  name: string;
  rate: string;
  currency: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

class PrintfulService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PRINTFUL_API_KEY || "";
  }

  private async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Printful API error");
    }

    const data = await response.json();
    return data.result;
  }

  // Get available products for printing
  async getProducts(): Promise<PrintfulProduct[]> {
    return this.request<PrintfulProduct[]>("/products");
  }

  // Get product variants (sizes, colors)
  async getProductVariants(productId: number): Promise<PrintfulVariant[]> {
    const product = await this.request<{ variants: PrintfulVariant[] }>(
      `/products/${productId}`
    );
    return product.variants;
  }

  // Calculate shipping rates
  async getShippingRates(
    recipient: PrintOrder["recipient"],
    items: { variant_id: number; quantity: number }[]
  ): Promise<ShippingRate[]> {
    const rates = await this.request<ShippingRate[]>("/shipping/rates", "POST", {
      recipient,
      items,
    });
    return rates;
  }

  // Create a print order
  async createOrder(order: PrintOrder): Promise<{
    id: number;
    status: string;
    shipping: string;
    created: number;
  }> {
    return this.request("/orders", "POST", order);
  }

  // Get order status
  async getOrderStatus(orderId: number): Promise<{
    id: number;
    status: string;
    shipping: string;
    shipments: {
      carrier: string;
      service: string;
      tracking_number: string;
      tracking_url: string;
    }[];
  }> {
    return this.request(`/orders/${orderId}`);
  }

  // Cancel an order
  async cancelOrder(orderId: number): Promise<void> {
    await this.request(`/orders/${orderId}`, "DELETE");
  }

  // Estimate order cost
  async estimateOrderCost(order: PrintOrder): Promise<{
    costs: {
      subtotal: string;
      discount: string;
      shipping: string;
      tax: string;
      total: string;
    };
  }> {
    return this.request("/orders/estimate-costs", "POST", order);
  }
}

export const printful = new PrintfulService();

// Product mappings for our print sizes
export const PRINT_PRODUCTS = {
  poster: {
    small: { variantId: 1, name: "Poster 8x10" },
    medium: { variantId: 2, name: "Poster 16x20" },
    large: { variantId: 3, name: "Poster 24x36" },
    xlarge: { variantId: 4, name: "Poster 30x40" },
  },
  canvas: {
    small: { variantId: 10, name: "Canvas 8x10" },
    medium: { variantId: 11, name: "Canvas 16x20" },
    large: { variantId: 12, name: "Canvas 24x36" },
    xlarge: { variantId: 13, name: "Canvas 30x40" },
  },
  metal: {
    small: { variantId: 20, name: "Metal Print 8x10" },
    medium: { variantId: 21, name: "Metal Print 16x20" },
    large: { variantId: 22, name: "Metal Print 24x36" },
    xlarge: { variantId: 23, name: "Metal Print 30x40" },
  },
  acrylic: {
    small: { variantId: 30, name: "Acrylic 8x10" },
    medium: { variantId: 31, name: "Acrylic 16x20" },
    large: { variantId: 32, name: "Acrylic 24x36" },
    xlarge: { variantId: 33, name: "Acrylic 30x40" },
  },
};

// Helper to create a print order
export async function createPrintOrder(
  imageUrl: string,
  material: keyof typeof PRINT_PRODUCTS,
  size: keyof (typeof PRINT_PRODUCTS)["poster"],
  quantity: number,
  shippingAddress: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email?: string;
    phone?: string;
  }
): Promise<{ orderId: number; status: string }> {
  const product = PRINT_PRODUCTS[material][size];

  const order: PrintOrder = {
    recipient: {
      name: shippingAddress.name,
      address1: shippingAddress.address1,
      address2: shippingAddress.address2,
      city: shippingAddress.city,
      state_code: shippingAddress.state,
      country_code: shippingAddress.country,
      zip: shippingAddress.zip,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
    },
    items: [
      {
        variant_id: product.variantId,
        quantity,
        files: [
          {
            url: imageUrl,
            type: "front",
          },
        ],
      },
    ],
  };

  const result = await printful.createOrder(order);
  return { orderId: result.id, status: result.status };
}
