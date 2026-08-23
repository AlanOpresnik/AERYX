import FormField from "./FormField";

type PersonalInfoData = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export default function PersonalInfoSection({
  data,
}: {
  data: PersonalInfoData;
}) {
  return (
    <section>
      <h2 className="font-display text-lg font-medium text-neutral-900">
        Datos personales
      </h2>
      <p className="text-sm text-neutral-500 mt-1 mb-5">
        Así te vamos a identificar en tus pedidos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <FormField
          label="Nombre"
          name="firstName"
          defaultValue={data.firstName}
          placeholder="Juan"
        />

        <FormField
          label="Apellido"
          name="lastName"
          defaultValue={data.lastName}
          placeholder="Pérez"
        />

        <FormField
          label="Teléfono"
          name="phone"
          type="tel"
          defaultValue={data.phone}
          placeholder="11 2345 6789"
          className="sm:col-span-2"
        />
      </div>
    </section>
  );
}