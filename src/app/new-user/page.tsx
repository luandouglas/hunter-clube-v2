"use client";
import Layout from "@/components/layout/Layout";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState, Fragment, FC } from "react";
import { db } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";

const Users = () => {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [cr, setCr] = useState("");

  const gerarMatriculaAleatoria = () => {
    const prefixo = "MAT"; // Prefixo da matrícula
    const digitosAleatorios = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0"); // Gera 4 dígitos aleatórios

    return `${prefixo}-${digitosAleatorios}`;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Lógica para processar os dados do formulário aqui
    console.log("Dados enviados:", gerarMatriculaAleatoria(), nome, cidade, cr);

    try {
      await addDoc(collection(db, "users"), {
        matricula: gerarMatriculaAleatoria(),
        nome,
        cidade,
        cr,
      });

      setNome("");
      setCidade("");
      setCr("");
      alert("Atirador cadastrado com sucesso!");
    } catch (error) {}
    // Limpar os campos do formulário
  };

  return (
    <Layout>
      <div className="flex flex-row items-center">
        <h1 className="flex flex-1 text-gray-700 py-4 font-bold text-xl">
          Novo atirador
        </h1>
      </div>
      <div className="max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 py-6 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nome"
            >
              Nome
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nome"
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="cidade"
            >
              Cidade
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cidade"
              type="text"
              placeholder="Digite a cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="cr"
            >
              CR
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cr"
              type="text"
              placeholder="Digite o CR"
              value={cr}
              onChange={(e) => setCr(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              disabled={nome === "" || cidade === ""}
              className="bg-blue-gray-500 disabled:bg-blue-gray-200 hover:bg-blue-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Users;
