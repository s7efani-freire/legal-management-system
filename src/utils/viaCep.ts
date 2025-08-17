export const buscarEndereco = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      return {
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      };
    }
    return null;
  } catch (err) {
    console.error("Erro ao buscar CEP:", err);
    return null;
  }
};
