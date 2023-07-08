"use client";
import Layout from "@/components/layout/Layout";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState, Fragment } from "react";
import { db } from "../../../firebaseConfig";
import { useParams, useRouter } from "next/navigation";

type Exam = {
  id: string;
  levels?: { label: string; value: string }[];
  guns?: { label: string; value: string }[];
  tipo_prova: string;
};

const RankingEvent = () => {
  const params = useParams();
  const router = useRouter();
  const [ranking, setRanking] = useState<any[]>([]);
  const [exams, setExams] = useState<Exam[]>([
    {
      tipo_prova: "Apuração - Carabina Precisão 22 a 25 Metros",
      id: "EfvFedkhOSML884He43N",
    },
    {
      guns: [
        {
          value: "pistol",
          label: "Pistola",
        },
        {
          value: "revolver",
          label: "Revolver",
        },
      ],
      levels: [
        {
          value: "beginner",
          label: "Iniciante",
        },
        {
          label: "Master",
          value: "master",
        },
      ],
      tipo_prova: "Apuração de Saque Preciso",
      id: "KkAF46R6WrwZWq1FNhvX",
    },
    {
      levels: [
        {
          value: "beginner",
          label: "Iniciante",
        },
        {
          value: "master",
          label: "Master",
        },
        {
          label: "Super master",
          value: "super-master",
        },
      ],
      tipo_prova: "Silhueta Metálica 22 e Precisão",
      id: "PCb1rh0OrOzxAmCTghGB",
    },
    {
      guns: [
        {
          label: "Pistola",
          value: "pistol",
        },
        {
          value: "revolver",
          label: "Revolver",
        },
      ],
      tipo_prova: "Súmula de Apuração de Fogo Central",
      levels: [
        {
          value: "beginner",
          label: "Iniciante",
        },
        {
          label: "Master",
          value: "master",
        },
      ],
      id: "YchOCURkmZCTsymgHwG0",
    },
    {
      tipo_prova: "Apuração de Prova Extra - Small Pistol",
      levels: [
        {
          value: "beginner",
          label: "Iniciante",
        },
        {
          label: "Master",
          value: "master",
        },
      ],
      id: "cpxPRShLAuDSmBwFKHXw",
    },
    {
      tipo_prova: "Trap Americano",
      levels: [
        {
          label: "Iniciante",
          value: "beginner",
        },
        {
          value: "master",
          label: "Master",
        },
      ],
      id: "hej6E1jjnq81xZMGiqEi",
    },
    {
      levels: [
        {
          label: "Iniciante",
          value: "beginner",
        },
        {
          label: "Master",
          value: "master",
        },
      ],
      tipo_prova: "Silhueta Metálica 22 Apoiado",
      id: "q00RXisO4sQqOZ8JfqvW",
    },
    {
      levels: [
        {
          value: "beginner",
          label: "Iniciante",
        },
        {
          value: "master",
          label: "Master",
        },
      ],
      tipo_prova: "Percurso de Caça",
      id: "qnpGZ7u0IW01TZQ4olPn",
    },
  ]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<any>();
  const [selectedGun, setSelectedGun] = useState<string>("");

  const [levels, setLevels] = useState<any[]>([]);
  const [guns, setGuns] = useState<any[]>([]);

  const [showCategory, setShowCategory] = useState<boolean>(true);
  const [showGun, setShowGun] = useState<boolean>(true);
  const [eventId, setEventId] = useState<string>("");

  const fetchRanking = async () => {
    console.log(selectedExam, selectedGun, selectedLevel);

    if (selectedExam === "") return;
    if (selectedExam != "EfvFedkhOSML884He43N") setShowCategory(true);
    if (selectedExam == "EfvFedkhOSML884He43N") fetchCarabina22MiraAberta();
    else if (selectedExam == "KkAF46R6WrwZWq1FNhvX") fetchSaquePreciso();
    else if (selectedExam == "PCb1rh0OrOzxAmCTghGB") fetchSM22Precisao();
    else if (selectedExam == "YchOCURkmZCTsymgHwG0") fetchFogoCentral();
    else if (selectedExam == "cpxPRShLAuDSmBwFKHXw") fetchSmallPistol();
    else if (selectedExam == "hej6E1jjnq81xZMGiqEi") fetchTrapAmericano();
    else if (selectedExam == "q00RXisO4sQqOZ8JfqvW") fetchSM22Apoiado();
    else if (selectedExam == "qnpGZ7u0IW01TZQ4olPn") fetchPercursoCaca();
  };

  const removeDuplicateNames = (persons: any[]) => {
    const map = new Map();

    for (const person of persons) {
      if (
        !map.has(person.name) ||
        map.get(person.name)!.results.total < person.results.total
      ) {
        map.set(person.name, person);
      }
    }

    return Array.from(map.values());
  };
  useEffect(() => {
    if (!params.id) {
      router.push("/events");
    }
    setEventId(params.id);
  }, []);

  const handleChangeExam = (value: string) => {
    setSelectedExam(value);
    const find = exams.find((e) => e.id == value);
    if (!find?.guns) {
      setGuns([]);
      setSelectedGun("");
    } else {
      setGuns(find.guns);
      setSelectedGun("pistol");
    }

    if (!find?.levels) {
      handleChangeLevel("");
    } else {
      handleChangeLevel("beginner");
    }
    setLevels(find?.levels || []);
  };
  const handleChangeLevel = (value: any) => {
    setSelectedLevel(value);
  };

  const handleChangeGun = (value: any) => {
    setSelectedGun(value);
  };

  const returnClass = (position: number) => {
    if (position === 1) {
      return "w-1 px-6 py-3 bg-gold text-white whitespace-nowrap dark:text-white text-center";
    } else if (position === 2) {
      return "w-1 px-6 py-3 bg-silver text-white whitespace-nowrap dark:text-white text-center";
    } else if (position === 3) {
      return "w-1 px-6 py-3 bg-bronze text-white whitespace-nowrap dark:text-white text-center";
    } else {
      return "w-1 px-6 py-3 text-center text-gray-900 whitespace-nowrap dark:text-white";
    }
  };

  const fetchCarabina22MiraAberta = useCallback(async () => {
    setShowCategory(false);
    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", eventId),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));

    setRanking(data);
  }, []);
  const fetchFogoCentral = async () => {
    setShowGun(true);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", eventId),
        where("results.level", "==", selectedLevel),
        where("results.gun", "==", selectedGun),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));

    setRanking(removeDuplicateNames(data));
  };
  const fetchPercursoCaca = async () => {
    setShowCategory(true);
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("results.level", "==", selectedLevel),
        where("eventId", "==", eventId),
        orderBy("results.total", "desc")
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));
    setRanking(removeDuplicateNames(data));
  };
  const fetchSaquePreciso = async () => {
    setShowGun(true);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", eventId),
        where("results.level", "==", selectedLevel),
        where("results.gun", "==", selectedGun),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));

    setRanking(removeDuplicateNames(data));
  };
  const fetchSM22Apoiado = async () => {
    setShowCategory(true);
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("results.level", "==", selectedLevel),
        where("eventId", "==", eventId),
        orderBy("results.total", "desc")
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));

    setRanking(removeDuplicateNames(data));
  };
  const fetchSM22Precisao = async () => {
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", eventId),
        where("results.level", "==", selectedLevel),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));

    setRanking(removeDuplicateNames(data));
  };
  const fetchSmallPistol = async () => {
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", eventId),
        where("results.level", "==", selectedLevel),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));

    setRanking(removeDuplicateNames(data));
  };
  const fetchTrapAmericano = async () => {
    setShowCategory(false);
    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", eventId),
        orderBy("results.total", "desc")
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));
    setRanking(removeDuplicateNames(data));
  };

  return (
    <Layout>
      <h1 className="text-gray-700 py-4 font-bold text-xl">Ranking</h1>

      <br></br>

      <div className="relative w-full flex flex-row items-center gap-4 mb-4">
        <select
          className="text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
          value={selectedExam}
          onChange={(e) => handleChangeExam(e.target.value)}
        >
          <option key={0} value={""} disabled>
            Selecione a prova
          </option>

          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.tipo_prova}
            </option>
          ))}
        </select>
        {levels.length ? (
          <select
            className="bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
            value={selectedLevel}
            onChange={(e) => handleChangeLevel(e.target.value)}
          >
            <option value={undefined} key={0} disabled>
              Selecione a classificação
            </option>

            {levels.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        ) : null}
        {guns.length ? (
          <select
            className="bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
            value={selectedGun}
            onChange={(e) => handleChangeGun(e.target.value)}
          >
            <option value={undefined} key={0} disabled>
              Selecione o armamento
            </option>

            {guns.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        ) : null}
        <button
          className="bg-blue-600 p-2 px-4 rounded-lg text-white"
          onClick={() => fetchRanking()}
        >
          Buscar
        </button>
        {/* <Button onClick={() => fetchRanking()}>Buscar</Button> */}
      </div>
      {JSON.stringify(showGun)}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {ranking.length ? (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Pos.
                </th>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                {showCategory && (
                  <th scope="col" className="px-6 py-3">
                    Categoria
                  </th>
                )}

                {showGun == true && (
                  <th scope="col" className="px-6 py-3">
                    Armamento
                  </th>
                )}
                <th scope="col" className="px-6 py-3">
                  Pontuação
                </th>
              </tr>
            </thead>

            <tbody>
              {ranking.map((el, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className={returnClass(index + 1)}>{index + 1}</td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {el.name}
                  </td>
                  {showCategory && (
                    <td className="px-6 py-4 text-gray-900">
                      {el.results.level == "beginner"
                        ? "Inciante"
                        : el.results.level == "master"
                        ? "Master"
                        : "Super Master"}
                    </td>
                  )}
                  {el.results.gun && (
                    <td className="px-6 py-4 text-gray-900">
                      {el.results.gun == "pistol" ? "Pistola" : "Revolver"}
                    </td>
                  )}
                  <td className=" text-gray-900  px-6 py-4">
                    {el.results.total}
                  </td>
                  {/* {el.exams.map((e: any, index: number) => (
                    <td
                      className={`text-gray-900 px-6 py-4 ${
                        index > 1 && "text-center"
                      }`}
                    >
                      {e}
                    </td>
                  ))} */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </Layout>
  );
};

export default RankingEvent;
