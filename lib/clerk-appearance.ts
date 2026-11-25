import { esUY } from "@clerk/localizations";

/**
 * Apariencia global de Clerk: login, registro, verificación y perfil.
 * Clerk escribe sus estilos en la capa "clerk" (ver globals.css), por debajo de las
 * utilidades de Tailwind, así que las clases de `elements` siempre ganan.
 */
export const clerkAppearance = {
  cssLayerName: "clerk",
  options: {
    socialButtonsVariant: "blockButton",
    logoPlacement: "none",
    animations: true,
  },
  variables: {
    colorPrimary: "#f4f4f2",
    colorPrimaryForeground: "#070707",
    colorDanger: "#f87171",
    colorSuccess: "#6ee7b7",
    colorNeutral: "#f4f4f2",
    colorForeground: "#f4f4f2",
    colorMutedForeground: "#9c9c9c",
    colorMuted: "#161616",
    colorBackground: "#070707",
    colorInput: "#0f0f0f",
    colorInputForeground: "#f4f4f2",
    colorBorder: "#2b2b2b",
    colorRing: "rgba(244,244,242,0.35)",
    colorShadow: "rgba(0,0,0,0.6)",
    colorModalBackdrop: "rgba(0,0,0,0.7)",
    fontFamily: "var(--font-geist), system-ui, sans-serif",
    fontSize: "0.9375rem",
    borderRadius: "0.875rem",
  },
  elements: {
    // La tarjeta de Clerk desaparece: el formulario se apoya directo en la página
    rootBox: "w-full",
    // overflow visible: el badge "Último usado" sobresale del borde del botón
    cardBox: "w-full max-w-none overflow-visible rounded-none border-0 bg-transparent shadow-none",
    card: "gap-7 rounded-none border-0 bg-transparent p-0 shadow-none",
    header: "items-start gap-2 text-left",
    headerTitle: "text-[clamp(2rem,4vw,2.625rem)] font-medium leading-[1.02] tracking-[-0.04em] text-balance",
    headerSubtitle: "text-[0.9375rem] leading-relaxed text-muted-foreground text-pretty",
    socialButtons: "gap-2",
    socialButtonsBlockButton:
      "press h-12 rounded-full border border-border bg-transparent text-foreground shadow-none transition-[background-color,border-color,transform] duration-150 hover:border-foreground/30 hover:bg-foreground/[0.04]",
    socialButtonsBlockButtonText: "text-[0.9375rem] font-medium",
    dividerLine: "bg-border",
    dividerText: "text-xs text-muted-foreground",
    formFieldLabel: "text-sm font-medium text-foreground",
    formFieldInput:
      "!h-12 !max-h-none rounded-xl border border-border bg-[#0f0f0f] !px-4 text-[0.9375rem] shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#6f6f6f] hover:border-foreground/25 focus:border-foreground/50 focus:ring-4 focus:ring-foreground/10",
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
    formFieldAction: "text-sm text-muted-foreground hover:text-foreground",
    formFieldErrorText: "text-[0.8125rem] text-red-300",
    formFieldSuccessText: "text-[0.8125rem] text-emerald-300",
    formFieldHintText: "text-[0.8125rem] text-muted-foreground",
    formButtonPrimary:
      "press h-12 rounded-full bg-foreground text-[0.9375rem] font-medium normal-case tracking-normal text-background shadow-none transition-[background-color,transform] duration-150 hover:bg-white after:hidden",
    formButtonReset: "text-muted-foreground hover:text-foreground",
    otpCodeFieldInput:
      "!h-14 !max-h-none !w-12 rounded-xl border border-border bg-[#0f0f0f] text-xl font-medium tabular-nums focus:border-foreground/50",
    identityPreview: "rounded-full border border-border bg-transparent",
    identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
    alert: "rounded-xl border border-red-400/30 bg-red-400/10 text-red-200",
    footer: "bg-transparent bg-none p-0 shadow-none [&>*]:bg-transparent",
    footerAction: "justify-start bg-transparent px-0 pt-2",
    footerActionText: "text-sm text-muted-foreground",
    footerActionLink: "text-sm font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline",
    backLink: "text-muted-foreground hover:text-foreground",
  },
} as const;

/** Textos en español rioplatense, con títulos propios de Aeryx. */
export const clerkLocalization = {
  ...esUY,
  // es-UY deja algunos textos en inglés
  formFieldInputPlaceholder__password: "Elegí una contraseña",
  formFieldInputPlaceholder__signUpPassword: "Elegí una contraseña",
  formFieldInputPlaceholder__confirmPassword: "Repetí la contraseña",
  signIn: {
    ...esUY.signIn,
    start: {
      ...esUY.signIn?.start,
      title: "Volvé a la partida",
      subtitle: "Ingresá para seguir tus pedidos y comprar más rápido.",
      titleCombined: "Volvé a la partida",
    },
  },
  signUp: {
    ...esUY.signUp,
    start: {
      ...esUY.signUp?.start,
      title: "Creá tu cuenta",
      subtitle: "Guardá tus datos de envío y seguí cada pedido en un solo lugar.",
      titleCombined: "Creá tu cuenta",
      subtitleCombined: "Guardá tus datos de envío y seguí cada pedido en un solo lugar.",
    },
  },
};
