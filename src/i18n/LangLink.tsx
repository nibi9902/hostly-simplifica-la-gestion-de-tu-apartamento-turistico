import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "./useLang";

/**
 * <LangLink to="/funcionalidades"> → automàticament prefixa amb /es/ o /ca/.
 * Si el `to` ja té prefix d'idioma o és extern (http), no toca res.
 *
 * Accepta `ref` perquè es pugui animar (`MotionLangLink`): abans, `motion.create(LangLink)`
 * trencava la pàgina d'alternatives («Invalid value used as weak map key»).
 */
export const LangLink = forwardRef<HTMLAnchorElement, LinkProps & { to: string }>(function LangLink(props, ref) {
  const { localized } = useLang();
  const { to, ...rest } = props;

  // External URLs / mailto / tel: passen tal qual
  const isExternal = /^(https?:|mailto:|tel:|#)/i.test(to);
  const finalTo = isExternal ? to : localized(to);

  return <Link ref={ref} to={finalTo} {...rest} />;
});

/** Un enllaç amb idioma que es pot animar com un `motion.a`. */
export const MotionLangLink = motion.create(LangLink);

export default LangLink;
