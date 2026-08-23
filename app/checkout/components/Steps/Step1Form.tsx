"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Loader2, MapPin } from "lucide-react";
import { Field } from "../Field/Field";
import { api } from "@/lib/api/api";

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

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressNumber: string;
  betweenStreet1: string;
  betweenStreet2: string;
  city: string;
  postalCode: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  placeId: number | string | null;
  approximate: boolean;
};

type Step1FormProps = {
  formData: CheckoutFormData;
  onChange: (data: CheckoutFormData) => void;
  section?: "buyer" | "shipping" | "all";
  savedAddress?: SavedAddress | null;
  savedAddressLoading?: boolean;
};

type AddressResult = {
  id: string;
  placeId: number | null;
  osmType: string | null;
  osmId: number | null;
  address: string;
  addressNumber: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
  lat: number;
  lon: number;
  importance: number;
  type: string | null;
  source?: string;
  approximate?: boolean;
};

export default function Step1Form({
  formData,
  onChange,
  section = "all",
  savedAddress = null,
  savedAddressLoading = false,
}: Step1FormProps) {
  const [addressMode, setAddressMode] = useState<"saved" | "new">(
    savedAddress ? "saved" : "new",
  );
  const addressModeInitialized = useRef(Boolean(savedAddress));

  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const isBuyer = section === "buyer" || section === "all";
  const isShipping = section === "shipping" || section === "all";

  useEffect(() => {
    if (savedAddress && !addressModeInitialized.current) {
      addressModeInitialized.current = true;
      setAddressMode("saved");
    }
  }, [savedAddress]);

  const applySavedAddress = () => {
    if (!savedAddress) return;

    addressModeInitialized.current = true;
    setAddressMode("saved");
    setAddressSelected(true);
    setSuggestions([]);

    onChange({
      ...formData,
      address: savedAddress.address ?? "",
      addressNumber: savedAddress.addressNumber ?? "",
      betweenStreet1: savedAddress.betweenStreet1 ?? "",
      betweenStreet2: savedAddress.betweenStreet2 ?? "",
      city: savedAddress.city ?? "",
      postalCode: savedAddress.postalCode ?? "",
      province: savedAddress.province ?? "",
      latitude: savedAddress.latitude ?? null,
      longitude: savedAddress.longitude ?? null,
      placeId: savedAddress.placeId ?? null,
      approximate: Boolean(savedAddress.approximate),
    });
  };

  const useNewAddress = () => {
    addressModeInitialized.current = true;
    setAddressMode("new");
    setAddressSelected(false);
    setSuggestions([]);

    onChange({
      ...formData,
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
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const handleAddressChange = (value: string) => {
    setAddressSelected(false);
    setSuggestions([]);
    onChange({
      ...formData,
      address: value,
      latitude: null,
      longitude: null,
      placeId: null,
      approximate: false,
    });
  };

  const handleAddressNumberChange = (value: string) => {
    setAddressSelected(false);
    setSuggestions([]);
    onChange({
      ...formData,
      addressNumber: value,
      latitude: null,
      longitude: null,
      placeId: null,
      approximate: false,
    });
  };

  useEffect(() => {
    if (!isShipping) return;

    const street = formData.address.trim();
    const number = formData.addressNumber.trim();
    const city = formData.city.trim();
    const postalCode = formData.postalCode.trim();

    if (
      street.length < 3 ||
      !number ||
      !city ||
      !postalCode ||
      addressSelected
    ) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        setSearching(true);
        const response = await api.shipping.autocomplete(
          street,
          number,
          city,
          postalCode,
        );

        if (!response?.success) {
          setSuggestions([]);
          return;
        }

        setSuggestions(response.results || []);
      } catch (error) {
        console.error("Error buscando dirección:", error);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 700);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [
    isShipping,
    formData.address,
    formData.addressNumber,
    formData.city,
    formData.postalCode,
    addressSelected,
  ]);

  const handleSelectAddress = (result: AddressResult) => {
    setAddressSelected(true);
    setSuggestions([]);

    onChange({
      ...formData,
      address: result.address,
      addressNumber: result.addressNumber || formData.addressNumber,
      city: result.city || formData.city,
      postalCode: result.postalCode || formData.postalCode,
      province: result.province || formData.province,
      latitude: result.lat,
      longitude: result.lon,
      placeId: result.placeId,
      approximate: Boolean(result.approximate),
    });
  };

  const hasAddressData =
    formData.address.trim() && formData.addressNumber.trim();
  const hasLocation =
    formData.latitude !== null && formData.longitude !== null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {isBuyer && (
        <>
          <Field
            name="firstName"
            label="Nombre"
            placeholder="Tu nombre"
            value={formData.firstName}
            onChange={(value) => handleChange("firstName", value)}
            required
          />

          <Field
            name="lastName"
            label="Apellido"
            placeholder="Tu apellido"
            value={formData.lastName}
            onChange={(value) => handleChange("lastName", value)}
            required
          />

          <Field
            name="email"
            label="Email"
            placeholder="tu@email.com"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            full
            required
          />

          <Field
            name="phone"
            label="Teléfono"
            placeholder="+54 11 0000 0000"
            type="tel"
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            full
            required
          />
        </>
      )}

      {isShipping && (
        <>
          {savedAddress && (
            <div className="sm:col-span-2 mb-2">
              <p className="mb-4 border-b border-black/15 pb-3 text-[10px] font-bold uppercase tracking-[0.17em]">
                Dirección de entrega
              </p>

              {savedAddressLoading ? (
                <div className="border border-black/10 bg-white/50 p-5 text-sm text-black/45">
                  Cargando tu dirección guardada...
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={applySavedAddress}
                    className={`w-full border p-5 text-left transition ${
                      addressMode === "saved"
                        ? "border-black bg-white"
                        : "border-black/15 bg-white/40 hover:border-black/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">
                            Usar mi dirección guardada
                          </p>
                          {addressMode === "saved" && (
                            <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
                          )}
                        </div>
                        <p className="mt-2 text-sm text-black/55">
                          {savedAddress.address ?? ""} {savedAddress.addressNumber ?? ""}
                        </p>
                        <p className="text-xs text-black/45">
                          {savedAddress.city ?? ""}
                          {savedAddress.postalCode
                            ? ` · CP ${savedAddress.postalCode}`
                            : ""}
                          {savedAddress.province
                            ? ` · ${savedAddress.province}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={useNewAddress}
                    className={`mt-3 w-full border p-4 text-left transition ${
                      addressMode === "new"
                        ? "border-black bg-white"
                        : "border-black/15 bg-white/40 hover:border-black/40"
                    }`}
                  >
                    <p className="text-sm font-semibold">Usar una nueva dirección</p>
                    <p className="mt-1 text-xs text-black/45">
                      Ingresar manualmente otra dirección de entrega.
                    </p>
                  </button>
                </>
              )}
            </div>
          )}

          {(!savedAddress || addressMode === "new") && (
            <>
          <div className="relative">
            <Field
              name="address"
              label="Calle"
              placeholder="Ej: Constitución"
              value={formData.address}
              onChange={handleAddressChange}
              full
              required
            />
          </div>

          <Field
            name="addressNumber"
            label="Altura"
            placeholder="Ej: 405"
            type="text"
            value={formData.addressNumber}
            onChange={handleAddressNumberChange}
            required
          />

          <Field
            name="city"
            label="Localidad"
            placeholder="Ej: Merlo"
            value={formData.city}
            onChange={(value) => {
              setAddressSelected(false);
              onChange({
                ...formData,
                city: value,
                latitude: null,
                longitude: null,
                placeId: null,
                approximate: false,
              });
            }}
            required
          />

          <Field
            name="postalCode"
            label="Código postal"
            placeholder="Ej: 1722"
            value={formData.postalCode}
            onChange={(value) => {
              setAddressSelected(false);
              onChange({
                ...formData,
                postalCode: value,
                latitude: null,
                longitude: null,
                placeId: null,
                approximate: false,
              });
            }}
            required
          />

          <Field
            name="province"
            label="Provincia"
            placeholder="Ej: Buenos Aires"
            value={formData.province}
            onChange={(value) => handleChange("province", value)}
            full
            required
          />

          {(searching || suggestions.length > 0) && (
            <div className="relative sm:col-span-2">
              <div className="border border-black/15 bg-white">
                {searching && (
                  <div className="flex items-center gap-3 px-4 py-4 text-sm text-black/50">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Buscando dirección exacta...
                  </div>
                )}

                {!searching &&
                  suggestions.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleSelectAddress(result)}
                      className="flex w-full items-start gap-3 border-b border-black/10 px-4 py-4 text-left transition last:border-b-0 hover:bg-black/[0.03]"
                    >
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-black/45"
                        strokeWidth={1.5}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-black">
                            {result.address} {result.addressNumber}
                          </p>
                          {result.approximate && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                              Aproximada
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-black/45">
                          {result.city}
                          {result.postalCode ? ` · CP ${result.postalCode}` : ""}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11px] text-black/35">
                          {result.fullAddress}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {hasAddressData && (
            <div className="sm:col-span-2">
              {hasLocation ? (
                formData.approximate ? (
                  <div className="flex items-start gap-2 border border-amber-300 bg-amber-50 px-4 py-3">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 text-amber-600"
                      strokeWidth={2}
                    />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">
                        Ubicación aproximada
                      </p>
                      <p className="mt-0.5 text-[11px] text-amber-700">
                        No encontramos la altura exacta. Si algo no coincide,
                        agregá una referencia en las entrecalles.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 border border-black/10 bg-black/[0.025] px-4 py-3">
                    <Check className="h-4 w-4" strokeWidth={2} />
                    <div>
                      <p className="text-xs font-semibold">Dirección localizada</p>
                      <p className="mt-0.5 text-[11px] text-black/45">
                        Coordenadas obtenidas correctamente.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <p className="text-xs text-black/45">
                  Completá calle, altura, localidad y código postal. Luego
                  seleccioná una dirección de la lista.
                </p>
              )}
            </div>
          )}

     
            <>
              <Field
                name="betweenStreet1"
                label="Entre calle 1"
                placeholder="Ej: San Martín"
                value={formData.betweenStreet1}
                onChange={(value) => handleChange("betweenStreet1", value)}
              />

              <Field
                name="betweenStreet2"
                label="Entre calle 2"
                placeholder="Ej: Belgrano"
                value={formData.betweenStreet2}
                onChange={(value) => handleChange("betweenStreet2", value)}
              />
            </>
        
            </>
          )}
        </>
      )}
    </div>
  );
}