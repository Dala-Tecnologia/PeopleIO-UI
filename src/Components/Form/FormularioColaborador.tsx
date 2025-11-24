//import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { estados } from "../../constrants/estados";
import { DatePicker } from "../ui/datepicker";
import { insertMaskInCEP } from "@/functions/address";
import { insertMaskInPhone } from "@/functions/phone";


export const FormularioColaborador = () => {
  //const { register } = useForm();
  //const { onSubmit } = () => {}  const [selected, setSelected] = useState(people[3])
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");


  function applyCEPMask(input: string){
    const masked = insertMaskInCEP(input);
    setCep(masked);
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(insertMaskInPhone(e.target.value));
  };


  return (
    <div className="isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-288.75"
        ></div>
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          Cadastro de Colaborador
        </h2>
        <p className="mt-2 text-lg/8 text-gray-400">
          Por favor, preencher o formulário corretamente.
        </p>
      </div>
      <form className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label className="pio-label">Nome completo</label>
            <input type="text" name="nome" className="pio-input" />
          </div>
          <div>
            <label className="pio-label">CPF</label>
            <input type="text" name="cpf" className="pio-input" />
          </div>
          <div>
            <label className="pio-label">Data de Nascimento</label>
            <DatePicker />
          </div>
          <div>
            <label className="pio-label">Email</label>
            <input type="email" name="email" className="pio-input" />
          </div>
          <div>
            <label className="pio-label">Telefone</label>
            <input type="text" 
              name="telefone" 
              className="pio-input"
              value={telefone}
              onChange={handleChange}
              placeholder="(99) 99999-9999"
            />
          </div>

          <div>
            <label className="pio-label">RG</label>
            <input type="text" name="rg" className="pio-input" />
          </div>
          <div>
            <label className="pio-label">Órgão Emissor</label>
            <input type="text" name="orgaoEmissor" className="pio-input" />
          </div>
          <div>
            <label className="pio-label">UF</label>
            <Select name="uf">
              <SelectTrigger className="w-[180px]" >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {estados.map((estado) => (
                    <SelectItem key={estado.id} value={estado.name}>
                      {estado.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="pio-label">Data de Emissão</label>
            <DatePicker />
          </div>
          <div>
            <label className="pio-label">CEP</label>
            <input type="text" 
              name="cep" 
              className="pio-input"
              value={cep}
              onChange={(e) => applyCEPMask(e.target.value)}
              placeholder="00000-000"
              />

          </div>

        </div>

        <div className="mt-10">
          <button type="submit" className="pio-btn-primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};
