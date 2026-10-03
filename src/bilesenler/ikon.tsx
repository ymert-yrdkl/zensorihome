// Tek ikon ailesi: Phosphor (light). Sunucu ve istemci bileşenlerinde aynı içe aktarım çalışır.
import type { IconProps } from "@phosphor-icons/react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  Bag,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  Envelope,
  Heart,
  InstagramLogo,
  List,
  MagnifyingGlass,
  MapPin,
  Minus,
  Package,
  Plus,
  SlidersHorizontal,
  Storefront,
  Truck,
  Wallet,
  X,
} from "@phosphor-icons/react/ssr";
import type { ComponentType } from "react";

function sar(Ikon: ComponentType<IconProps>) {
  function Sarili(props: IconProps) {
    return <Ikon size={20} weight="light" aria-hidden="true" focusable="false" {...props} />;
  }
  return Sarili;
}

export const IkonSepet = sar(Bag);
export const IkonKalp = sar(Heart);
export const IkonAra = sar(MagnifyingGlass);
export const IkonMenu = sar(List);
export const IkonKapat = sar(X);
export const IkonArti = sar(Plus);
export const IkonEksi = sar(Minus);
export const IkonAsagi = sar(CaretDown);
export const IkonSol = sar(CaretLeft);
export const IkonSag = sar(CaretRight);
export const IkonOk = sar(ArrowRight);
export const IkonTamam = sar(Check);
export const IkonKargo = sar(Truck);
export const IkonIade = sar(ArrowCounterClockwise);
export const IkonInstagram = sar(InstagramLogo);
export const IkonFiltre = sar(SlidersHorizontal);
export const IkonPaket = sar(Package);
export const IkonOdeme = sar(Wallet);
export const IkonMagaza = sar(Storefront);
export const IkonEposta = sar(Envelope);
export const IkonKonum = sar(MapPin);
