"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard, Lock, ShieldCheck, Truck } from "lucide-react";

import { CheckoutItem } from "@/lib/interface/cart";
import { useCart } from "../context/cartContext";
import { Footer } from "@/components/Footer/Footer";
import CartError from "./components/CartError";
import Step1Form, { CheckoutFormData } from "./components/Steps/Step1Form";
import { PaymentOption } from "./components/PaymentOptions/PaymentOption";
import AsideProducts from "./components/AsideProducts/AsideProducts";
import Summary from "./components/Summary/Summary";
import { ShippingOption } from "./components/ShippingOption/ShippingOption";
import BankData from "./components/Bank_data/BankData";
import { api } from "@/lib/api/api";
import { useAuth } from "@clerk/nextjs";
import Steps from "./components/Steps/Steps";

type CheckoutProps = {
  onBack: () => void;
};

type CheckoutStep = "comprador" | "envio" | "pago" | "confirmacion";

type SavedAddress = {
  address?: string;
  addressNumber?: string;
  betweenStreet1?: string;
  betweenStreet2?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  latitude?: number | null;
  longitude?: number | null;
  placeId?: number | string | null;
  approximate?: boolean;
};

type ShippingOptionType = {
  id: string;
  title: string;
  description: string;
  price: number;
};

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "comprador", label: "Comprador" },
  { id: "envio", label: "Envío" },
  { id: "pago", label: "Compra" },
];

export default function Checkout({ onBack }: CheckoutProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    validateCart,
    loading: cartLoading,
  } = useCart();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  const { getToken } = useAuth();

  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(null);
  const [savedAddressLoading, setSavedAddressLoading] = useState(true);

  const [step, setStep] = useState<CheckoutStep>("comprador");

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    addressNumber: "",
    betweenStreet1: "",
    betweenStreet2: "",
    city: "",
    postalCode: "",
    province: "",
    latitude: null,
    longitude: null,
    placeId: null,
    approximate: false,
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOptionType[]>(
    [],
  );
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<string | null>(null);
  const [addressValidated, setAddressValidated] = useState(false);
  const [shippingManual, setShippingManual] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mp");

  useEffect(() => {
    let cancelled = false;

    const loadSavedAddress = async () => {
      try {
        setSavedAddressLoading(true);
        const token = await getToken();
        const response = await api.users.getMe(token);

        if (!cancelled && response?.success && response.user?.address) {
          setSavedAddress(response.user.address as SavedAddress);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("ERROR OBTENIENDO DIRECCIÓN GUARDADA:", error);
        }
      } finally {
        if (!cancelled) setSavedAddressLoading(false);
      }
    };

    loadSavedAddress();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      try {
        setLoadingCart(true);
        setCartError(null);

        if (!cart.length) {
          if (!cancelled) setItems([]);
          return;
        }

        const validatedItems = await validateCart(cart);

        if (!cancelled) setItems(validatedItems);
      } catch (error) {
        if (cancelled) return;

        console.error("Error validando carrito:", error);
        setCartError(
          error instanceof Error
            ? error.message
            : "No se pudo validar el carrito",
        );
      } finally {
        if (!cancelled) setLoadingCart(false);
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [cart, validateCart]);

  const handleFormChange = (nextFormData: CheckoutFormData) => {
    setFormData(nextFormData);

    setAddressValidated(false);
    setShippingOptions([]);
    setShippingMethod(null);
    setShippingManual(false);
  };

  const handleValidateAddress = async () => {
    const address = formData.address.trim();
    const addressNumber = formData.addressNumber.trim();
    const city = formData.city.trim();
    const postalCode = formData.postalCode.trim();

    if (!address || !addressNumber || !city || !postalCode) return;

    try {
      setShippingLoading(true);
      setAddressValidated(false);
      setShippingOptions([]);
      setShippingMethod(null);
      setShippingManual(false);

      const response = await api.shipping.evaluate({
        address,
        addressNumber,
        betweenStreet1: formData.betweenStreet1.trim(),
        betweenStreet2: formData.betweenStreet2.trim(),
        city,
        postalCode,
        province: formData.province.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        placeId: formData.placeId ?? undefined,
        approximate: formData.approximate,
      });

      if (!response || !response.success || !response.shipping) {
        setShippingOptions([]);
        setShippingMethod("manual");
        setShippingManual(true);
        setAddressValidated(true);
        return;
      }

      const shipping = response.shipping;

      const option: ShippingOptionType = {
        id: shipping.id,
        title: shipping.title,
        description: shipping.description,
        price: shipping.price ?? 0,
      };

      setShippingOptions([option]);
      setShippingMethod(option.id);
      setShippingManual(false);
      setAddressValidated(true);
    } catch (error: any) {
      console.error("Error calculando envío:", error);

      const status = error?.response?.status;

      if (status === 422) {
        setShippingOptions([]);
        setShippingMethod("manual");
        setShippingManual(true);
        setAddressValidated(true);
        return;
      }

      setShippingOptions([]);
      setShippingMethod("manual");
      setShippingManual(true);
      setAddressValidated(true);
    } finally {
      setShippingLoading(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const selectedShippingOption = shippingOptions.find(
    (option) => option.id === shippingMethod,
  );

  const shippingCost = shippingManual
    ? 0
    : (selectedShippingOption?.price ?? 0);

  const total = subtotal + shippingCost;

  const canContinueToShipping =
    items.length > 0 &&
    Boolean(formData.firstName.trim()) &&
    Boolean(formData.lastName.trim()) &&
    Boolean(formData.email.trim()) &&
    Boolean(formData.phone.trim());

  const canContinueToPayment =
    Boolean(formData.address.trim()) &&
    Boolean(formData.addressNumber.trim()) &&
    Boolean(formData.city.trim()) &&
    Boolean(formData.postalCode.trim()) &&
    addressValidated &&
    !shippingLoading;

  const handleSubmitCheckout = async () => {
    try {
      const data = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          addressNumber: formData.addressNumber,
          betweenStreet1: formData.betweenStreet1,
          betweenStreet2: formData.betweenStreet2,
          city: formData.city,
          postalCode: formData.postalCode,
          province: formData.province,
          latitude: formData.latitude,
          longitude: formData.longitude,
          placeId:
            formData.placeId !== null && formData.placeId !== undefined
              ? String(formData.placeId)
              : null,
          approximate: formData.approximate,
        },
        shipping: {
          method: shippingMethod,
          manual: shippingManual,
          option: selectedShippingOption
            ? {
                id: selectedShippingOption.id,
                title: selectedShippingOption.title,
                description: selectedShippingOption.description,
                price: selectedShippingOption.price,
              }
            : null,
          cost: shippingCost,
        },
        payment: {
          method: paymentMethod,
        },
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      console.log("========== CHECKOUT DATA ==========");
      console.log(JSON.stringify(data, null, 2));
      console.log("====================================");

      const response = await api.orders.create(data);

      console.log("========== RESPUESTA BACKEND ==========");
      console.log(response);
      console.log("=======================================");

      if (paymentMethod === "mp" && response?.mercadoPago?.initPoint) {
        window.location.href = response.mercadoPago.initPoint;
        return;
      }

      if (paymentMethod === "Transferencia_bancaria") {
        setStep("confirmacion");
      }
    } catch (error) {
      console.error("ERROR CREANDO CHECKOUT:", error);
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const item = items.find((item) => item.productId === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    updateQuantity(productId, newQuantity);
  };

  if (loadingCart && !items.length) {
    return (
      <main className="mt-32 min-h-screen bg-[#f4f4f1] text-[#101010]">
        <div className="mx-auto max-w-[1440px] px-5 pt-10 sm:px-8 lg:px-12 lg:pt-16">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-black/45">
              Validando carrito...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (cartError) return <CartError cartError={cartError} onBack={onBack} />;

  return (
    <main className="mt-32 min-h-screen bg-[#f4f4f1] text-[#101010]">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 sm:px-8 lg:px-12 lg:pt-16">
        <div className="mb-10 flex items-start justify-between border-b border-black/60 pb-3">
          <p className="eyebrow">Finalizar compra</p>
          <p className="eyebrow hidden sm:block">
            Carrito / {items.length}{" "}
            {items.length === 1 ? "artículo" : "artículos"}
          </p>
        </div>

        <Steps step={step} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div>
            {step === "comprador" && (
              <div>
                <h2 className="mb-3 font-display text-4xl tracking-[-0.06em] sm:text-5xl">
                  Datos del comprador
                </h2>
                <p className="mb-8 max-w-xl text-sm leading-6 text-black/50">
                  Completá tus datos para poder asociar correctamente la compra.
                </p>

                <Step1Form
                  section="buyer"
                  formData={formData}
                  onChange={handleFormChange}
                />

                <button
                  type="button"
                  onClick={() => setStep("envio")}
                  disabled={!canContinueToShipping}
                  className="mt-10 flex w-full items-center justify-center bg-black py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-12"
                >
                  Continuar a datos de envío
                </button>
              </div>
            )}

            {step === "envio" && (
              <div>
                <h2 className="mb-3 font-display text-4xl tracking-[-0.06em] sm:text-5xl">
                  Datos de envío
                </h2>
                <p className="mb-8 max-w-xl text-sm leading-6 text-black/50">
                  Indicá dónde querés recibir tu pedido. La dirección se valida
                  manualmente antes de calcular el envío.
                </p>

                <Step1Form
                  section="shipping"
                  formData={formData}
                  onChange={handleFormChange}
                  savedAddress={savedAddress}
                  savedAddressLoading={savedAddressLoading}
                />

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleValidateAddress}
                    disabled={
                      shippingLoading ||
                      !formData.address.trim() ||
                      !formData.addressNumber.trim() ||
                      !formData.city.trim() ||
                      !formData.postalCode.trim()
                    }
                    className="flex w-full items-center justify-center gap-2 border border-black bg-white py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {shippingLoading
                      ? "Validando dirección..."
                      : addressValidated
                        ? "Dirección validada ✓"
                        : "Validar dirección"}
                  </button>

                  {!addressValidated && (
                    <p className="mt-2 text-xs text-black/45">
                      Completá los datos de dirección y presioná el botón para
                      calcular el envío.
                    </p>
                  )}

                  {addressValidated &&
                    !shippingManual &&
                    shippingOptions.length > 0 && (
                      <p className="mt-2 text-xs text-black/45">
                        Dirección validada correctamente.
                      </p>
                    )}
                </div>

                <div className="mt-10">
                  <p className="mb-4 border-b border-black/15 pb-3 text-[10px] font-bold uppercase tracking-[0.17em]">
                    Método de envío
                  </p>

                  {!formData.address ||
                  !formData.addressNumber ||
                  !formData.city ||
                  !formData.postalCode ? (
                    <p className="text-sm text-black/45">
                      Completá la dirección para poder validar el envío.
                    </p>
                  ) : !addressValidated ? (
                    <p className="text-sm text-black/45">
                      Presioná "Validar dirección" para calcular las opciones de
                      envío.
                    </p>
                  ) : shippingLoading ? (
                    <p className="text-sm text-black/45">
                      Validando dirección...
                    </p>
                  ) : shippingManual ? (
                    <div className="border border-black/15 bg-white/60 p-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white">
                          <Truck className="h-4 w-4" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Envío a coordinar
                          </p>
                          <p className="mt-1 text-sm leading-6 text-black/55">
                            No pudimos calcular automáticamente el costo de
                            envío para esta ubicación.
                          </p>
                          <p className="mt-2 text-sm leading-6 text-black/55">
                            Podés continuar y nos vamos a contactar por WhatsApp
                            para coordinarlo.
                          </p>
                          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                            El costo del envío se confirma posteriormente
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : shippingOptions.length === 0 ? (
                    <div className="border border-black/15 bg-white/60 p-5">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-semibold">
                            Envío a coordinar
                          </p>
                          <p className="mt-1 text-sm text-black/55">
                            El costo se confirmará por WhatsApp.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <ShippingOption
                          key={option.id}
                          selected={shippingMethod === option.id}
                          onSelect={() => setShippingMethod(option.id)}
                          icon={<Truck className="h-5 w-5" strokeWidth={1.5} />}
                          title={option.title}
                          desc={option.description}
                          price={
                            option.price === 0
                              ? "Gratis"
                              : `$${option.price.toLocaleString("es-AR")}`
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep("comprador")}
                    className="border border-black/25 py-4 text-[11px] font-bold uppercase tracking-[0.18em] transition hover:bg-black/5 sm:px-8"
                  >
                    Volver
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("pago")}
                    disabled={!canContinueToPayment}
                    className="flex flex-1 items-center justify-center bg-black py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-12"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === "pago" && (
              <div>
                <h2 className="mb-3 font-display text-4xl tracking-[-0.06em] sm:text-5xl">
                  ¿Por dónde querés comprar?
                </h2>
                <p className="mb-8 max-w-xl text-sm leading-6 text-black/50">
                  Elegí el medio con el que querés realizar el pago de tu
                  pedido.
                </p>

                <div className="mb-8 space-y-3">
                  <PaymentOption
                    selected={paymentMethod === "mp"}
                    onSelect={() => setPaymentMethod("mp")}
                    icon={<CreditCard className="h-5 w-5" strokeWidth={1.5} />}
                    title="Mercado Pago"
                  />

                  <PaymentOption
                    selected={paymentMethod === "Transferencia_bancaria"}
                    onSelect={() => setPaymentMethod("Transferencia_bancaria")}
                    icon={<span className="text-sm font-bold">TB</span>}
                    title="Transferencia Bancaria"
                  />
                </div>

                {paymentMethod === "Transferencia_bancaria" && <BankData />}

                {shippingManual && (
                  <div className="mb-8 border border-black/15 bg-white/60 p-4">
                    <div className="flex gap-3">
                      <Truck
                        className="mt-0.5 h-4 w-4 shrink-0"
                        strokeWidth={1.5}
                      />
                      <p className="text-xs leading-5 text-black/60">
                        El costo del envío todavía no está incluido en el total.
                        Nos vamos a contactar por WhatsApp para coordinarlo.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center gap-2 text-xs text-black/45">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                  Pago cifrado y procesado de forma segura. No almacenamos tus
                  datos de tarjeta.
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep("envio")}
                    className="border border-black/25 py-4 text-[11px] font-bold uppercase tracking-[0.18em] transition hover:bg-black/5 sm:px-8"
                  >
                    Volver
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitCheckout}
                    disabled={cartLoading || !items.length}
                    className="flex flex-1 items-center justify-center gap-2 bg-black py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-12"
                  >
                    <Lock className="h-4 w-4" strokeWidth={1.5} />
                    {shippingManual
                      ? `Pagar $${subtotal.toLocaleString("es-AR")}`
                      : `Pagar $${total.toLocaleString("es-AR")}`}
                  </button>
                </div>
              </div>
            )}

            {step === "confirmacion" && (
              <div className="flex flex-col items-start">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c9f158]">
                  <Check className="h-8 w-8" strokeWidth={2} />
                </div>

                <h2 className="mb-4 font-display text-4xl tracking-[-0.06em] sm:text-5xl">
                  ¡Pedido confirmado!
                </h2>

                <p className="mb-8 max-w-md text-sm leading-6 text-black/55">
                  Gracias por tu compra. Te enviamos un correo con la
                  confirmación y el seguimiento del envío.
                </p>

                <div className="mb-10 w-full max-w-md border border-black/15 p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/55">Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toLocaleString("es-AR")}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-black/55">Envío</span>
                    <span className="font-semibold">
                      {shippingManual
                        ? "A coordinar"
                        : `$${shippingCost.toLocaleString("es-AR")}`}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-sm">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      ${total.toLocaleString("es-AR")}
                    </span>
                  </div>

                  {shippingManual && (
                    <p className="mt-4 text-xs leading-5 text-black/50">
                      El costo del envío se confirmará posteriormente por
                      WhatsApp.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onBack}
                  className="bg-black px-12 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a]"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="border border-black/15 bg-white/40">
              <div className="border-b border-black/15 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.17em]">
                  Tu pedido
                </p>
              </div>

              <div className="divide-y divide-black/10">
                <AsideProducts
                  cartLoading={cartLoading}
                  handleUpdateQuantity={handleUpdateQuantity}
                  items={items}
                />

                {!items.length && (
                  <div className="px-5 py-10 text-center text-sm text-black/45">
                    Tu carrito está vacío.
                  </div>
                )}
              </div>

              <Summary
                shippingCost={shippingCost}
                subtotal={subtotal}
                total={total}
              />

              {shippingManual && (
                <div className="border-t border-black/15 px-5 py-4">
                  <div className="flex items-start gap-2 text-[10px] uppercase tracking-[0.12em] text-black/50">
                    <Truck
                      className="mt-0.5 h-4 w-4 shrink-0"
                      strokeWidth={1.5}
                    />
                    <span>Envío a coordinar por WhatsApp</span>
                  </div>
                </div>
              )}

              {!shippingManual && (
                <div className="border-t border-black/15 px-5 py-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-black/45">
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                    Compra protegida
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3 px-1 text-[10px] uppercase tracking-[0.14em] text-black/40">
              <Truck className="h-4 w-4" strokeWidth={1.5} />
              {shippingManual
                ? "Envío a coordinar"
                : shippingMethod === "express"
                  ? "Envío exprés 24-48h"
                  : "Envío estándar 2-4 días"}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
