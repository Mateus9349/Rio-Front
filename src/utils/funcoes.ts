export function getIds(id: string, tipo: string, setter: (v: string) => void) {
    if (!id || id.trim() === '') return;
    console.log(id, tipo)
    setter(id);
}

export const normalizar = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();

export function removerEntreParenteses(texto: string): string {
  // remove tudo que estiver entre parênteses (inclusive os parênteses)
  return texto.replace(/\s*\([^)]*\)/g, "").trim();
}
