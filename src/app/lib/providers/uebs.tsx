"use client";
import { createContext } from "react";

export interface Ueb {
  code: string;
  name: string;
}
export const UebsContext = createContext<Ueb[]>([]);

interface Props {
  uebs: Ueb[];
  children: React.ReactNode;
}

export const UebsProvider = ({uebs, children}: Props) => {
  return <UebsContext.Provider value={uebs} children={children}/>
}

/* const getUebId = (groups: string[]) => {
  if (groups.includes('Internal/p_gestor_aica')) {
    return 16;
  }
  if (groups.includes('Internal/p_gestor_liorad')) {
    return 25;
  }
  if (groups.includes('Internal/p_gestor_jt')) {
    return 55;
  }
  if (groups.includes('Internal/p_gestor_citox')) {
    return 100;
  }
  if (groups.includes('Internal/p_gestor_sh')) {
    return 57;
  }

  return 0;
}; */
