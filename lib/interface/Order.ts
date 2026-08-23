export interface Order {
 _id: string;
        customer: {
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
        };
        shippingAddress: {
          address: string;
          addressNumber: string;
          betweenStreet1: string;
          betweenStreet2: string;
          city: string;
          postalCode: string;
          province: string;
          latitude: number | null;
          longitude: number | null;
          placeId: string | number | null;
          approximate: boolean;
        };
        items: {
          productId: string;
          name: string;
          image: string[];
          price: number;
          quantity: number;
          subtotal: number;
        }[];
        shipping: {
          method: string | null;
          manual: boolean;
          option: {
            id: string;
            title: string;
            description: string;
            price: number;
          } | null;
          cost: number;
        };
        totals: {
          subtotal: number;
          shipping: number;
          total: number;
        };
        payment: {
          method: string;
          status: string;
          preferenceId: string | null;
          paymentId: string | null;
          mpStatus: string | null;
        };
        status: string;
        createdAt: string;
        updatedAt: string;
}