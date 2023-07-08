"use client";
import Layout from "@/components/layout/Layout";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState, Fragment } from "react";
import { db } from "../../../firebaseConfig";
import { Tooltip } from "@material-tailwind/react";

import { useRouter } from "next/navigation";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [router] = useState(useRouter());

  const fetchEvents = useCallback(async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "events"), orderBy("date", "desc"))
    );
    const aux: any = [];
    querySnapshot.docs.forEach((e) => {
      aux.push({ ...e.data(), id: e.id });
    });
    setEvents(aux);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  const convertDate = (data: string) => {
    const partes: string[] = data.split("-");
    const novaData = `${partes[2]}/${partes[1]}/${partes[0]}`;
    return novaData;
  };
  return (
    <Layout>
      <div className="flex flex-row items-center">
        <h1 className="flex flex-1 text-gray-700 py-4 font-bold text-xl">
          Ranking
        </h1>

        <button className="bg-blue-gray-500 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            viewBox="0 -960 960 960"
            width="32"
          >
            <path
              fill="white"
              d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z"
            />
          </svg>
        </button>
      </div>

      <br></br>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>

              <th scope="col" className="px-6 py-3">
                Data
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((el: any, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap "
                >
                  <span className=" text-gray-900 hover:text-white bg-transparent  hover:bg-blue-gray-500 p-3 rounded-lg">
                    {el.name}
                  </span>
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {convertDate(el.date)}
                </td>

                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {el.status}
                </td>
                <td scope="row" className="px-6 py-4 space-x-2">
                  <Tooltip content="Visualizar resultados">
                    <button
                      onClick={() => {
                        router.push(`/ranking-event/${el.id}`, {
                          id: el.id,
                        });
                      }}
                      className="bg-blue-gray-700 p-1 px-2 rounded-lg "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                      >
                        <path
                          fill="#FFF"
                          d="M479.765-140Q563-140 621.5-198.265q58.5-58.264 58.5-141.5Q680-423 621.735-481.5q-58.264-58.5-141.5-58.5Q397-540 338.5-481.735q-58.5 58.264-58.5 141.5Q280-257 338.265-198.5q58.264 58.5 141.5 58.5ZM346-563q28-17 60-26.5t67-10.5L363-820H217l129 257Zm268 0 129-257H597l-83 167 30 60q19 5 36.5 12.5T614-563ZM273-183q-25-33-39-72.5T220-340q0-45 14-84.5t39-72.5q-57 10-95 53.5T140-340q0 60 38 103.5t95 53.5Zm414 0q57-10 95-53.5T820-340q0-60-38-103.5T687-497q25 33 39 72.5t14 84.5q0 45-14 84.5T687-183ZM480-80q-40 0-76.5-11.5T336-123q-9 2-18 2.5t-19 .5q-91 0-155-64T80-339q0-87 58-149t143-69L120-880h280l80 160 80-160h280L680-559q85 8 142.5 70T880-340q0 92-64 156t-156 64q-9 0-18.5-.5T623-123q-31 20-67 31.5T480-80Zm0-260ZM346-563 217-820l129 257Zm268 0 129-257-129 257ZM406-230l28-91-74-53h91l29-96 29 96h91l-74 53 28 91-74-56-74 56Z"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                  {el.status !== "Finalizado" && (
                    <Tooltip content="Registrar provas">
                      <button
                        onClick={() => {
                          router.push(`/register/${el.id}`, {
                            id: el.id,
                          });
                        }}
                        className="bg-blue-gray-700 p-1 px-2 rounded-lg "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20"
                          viewBox="0 -960 960 960"
                          width="20"
                        >
                          <path
                            fill="white"
                            d="M160-372v-60h640v60H160Zm0 160v-60h640v60H160Zm0-316v-60h640v60H160Zm0-160v-60h640v60H160Z"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
