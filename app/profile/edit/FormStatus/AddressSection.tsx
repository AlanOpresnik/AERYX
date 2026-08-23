import FormField from "./FormField";

type AddressData = {
  address?: string;
  addressNumber?: string;
  betweenStreet1?: string;
  betweenStreet2?: string;
  floorApt?: string;
  city?: string;
  postalCode?: string;
  province?: string;
};

export default function AddressSection({ data }: { data: AddressData }) {
  return (
    <section className="mt-8 pt-8 border-t border-neutral-200">
      <h2 className="font-display text-lg font-medium text-neutral-900">
        Dirección
      </h2>
      <p className="text-sm text-neutral-500 mt-1 mb-5">
        La usamos para calcular envíos y encontrarte más rápido.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* CALLE + NÚMERO */}
        <div className="sm:col-span-2 grid grid-cols-3 gap-4">
          <FormField
            label="Calle"
            name="address"
            defaultValue={data.address}
            placeholder="Av. Rivadavia"
            className="col-span-2"
          />

          <FormField
            label="Número"
            name="addressNumber"
            defaultValue={data.addressNumber}
            placeholder="1234"
          />
        </div>

        <FormField
          label="Entre calle 1"
          name="betweenStreet1"
          defaultValue={data.betweenStreet1}
          placeholder="San Martín"
          optional
        />

        <FormField
          label="Entre calle 2"
          name="betweenStreet2"
          defaultValue={data.betweenStreet2}
          placeholder="Belgrano"
          optional
        />

        <FormField
          label="Piso / Depto"
          name="floorApt"
          defaultValue={data.floorApt}
          placeholder="3° B"
          optional
        />

        <FormField
          label="Localidad"
          name="city"
          defaultValue={data.city}
          placeholder="Merlo"
        />

        <FormField
          label="Provincia"
          name="province"
          defaultValue={data.province}
          placeholder="Buenos Aires"
        />

        <FormField
          label="Código postal"
          name="postalCode"
          defaultValue={data.postalCode}
          placeholder="1722"
          optional
        />
      </div>
    </section>
  );
}