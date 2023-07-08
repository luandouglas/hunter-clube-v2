"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import Image from "next/image";

type Props = {
  onSubmitExam: (e: any) => void;
  shooter: string;
  examId: string;
  dateEvent: string;
};

type PointsObject = Record<string, number[]>;

type DataObject = {
  points: number[];
  pointsCounter: Record<number, number>;
  total: number;
  level: string;
};

type ObjectData = {
  pontuation: number;
  firstRankingDate: string;
  level?: string;
};

const FogoCentral: React.FC<Props> = ({
  onSubmitExam,
  shooter,
  dateEvent,
  examId,
}) => {
  const [values, setValues] = React.useState<any>({
    first: [0, 0, 0, 0, 0],
    second: [0, 0, 0, 0, 0],
    third: [0, 0, 0, 0, 0],
    fourth: [0, 0, 0, 0, 0],
  });

  const [gun, setGun] = React.useState("");

  const [level, setLevel] = React.useState<any>();
  const fetchLevel = useCallback(async () => {
    if (!shooter || !examId) {
      return;
    }
    const querySnapshot = await getDocs(
      query(
        collection(db, "levels"),
        where("name", "==", shooter),
        where("examId", "==", examId)
      )
    );
    const data: any = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));
    if (data.length > 0) {
      setLevel(data[0]);
    }
  }, []);

  useEffect(() => {
    fetchLevel();
    // fetchLevel();
  }, [shooter, fetchLevel]);

  const sumRow = (ind: string): number => {
    const row: (number | null)[] = values[ind];
    const filteredRow = row.filter(
      (num): num is number => num !== null && num !== undefined
    );
    const sum = filteredRow.reduce((acc: number, num: number) => acc + num, 0);

    return sum;
  };

  const countPoints = (points: PointsObject) => {
    let result: any = {};
    Object.values(points).forEach(function (array) {
      array.forEach(function (numero) {
        result[numero] = (result[numero] || 0) + 1;
      });
    });

    for (var i = 0; i <= 12; i++) {
      result[i] = result[i] || 0;
    }
    return result;
  };

  const sumValues = (): number => {
    let sum = 0;
    for (let i = 0; i < values.first.length; i++) {
      sum +=
        (values.first[i] || 0) +
        (values.second[i] || 0) +
        (values.third[i] || 0) +
        (values.fourth[i] || 0);
    }
    return sum;
  };

  const handleValueChange = (
    individual: string,
    index: number,
    newValue: string,
    maxValue: number
  ): void => {
    const value = Number(newValue);
    if (!(!isNaN(value) && value >= 0 && value <= maxValue)) return;

    setValues((prevValues: any) => {
      const updatedValues = { ...prevValues };
      updatedValues[individual] = [
        ...prevValues[individual].slice(0, index),
        value,
        ...prevValues[individual].slice(index + 1),
      ];
      return updatedValues;
    });
  };
  const checkLevel = (
    object: ObjectData | undefined,
    newDate: string
  ): boolean => {
    if (object && object.level && object.firstRankingDate !== newDate) {
      return true;
    }
    return false;
  };

  const adjustLevel = (
    object: ObjectData | undefined,
    newDate: string
  ): string => {
    console.log("1");

    if (checkLevel(object, newDate)) {
      console.log("2");
      return object!.level!;
    } else if (object && object.level && object.firstRankingDate === newDate) {
      console.log("3");
      if (object.pontuation <= 180) {
        console.log("4");
        return "beginner";
      } else {
        console.log("5");
        return "master";
      }
    } else {
      console.log("6");
      if (sumValues() <= 180) {
        console.log("7");
        return "beginner";
      } else {
        console.log("8");
        return "master";
      }
    }
  };

  const onSubmit = (): void => {
    onSubmitExam({
      points: values,
      pointsCounter: countPoints(values),
      total: sumValues(),
      level: adjustLevel(level, dateEvent),
      gun,
      examId,
      name: shooter,
    });
  };

  const getAttr = (key: number): any => {
    switch (key) {
      case 1:
        return "first";
      case 2:
        return "second";
      case 3:
        return "third";
      case 4:
        return "fourth";
    }
  };

  return (
    <>
      <div className="flex flex-row items-center">
        <div>
          {[1, 2, 3, 4].map((e) => (
            <div key={e}>
              <div className="flex flex-row items-center">
                <span className="w-24">{e}ª Serie</span>
                {[1, 2, 3, 4, 5].map((j) => (
                  <input
                    key={j}
                    className="border w-20 focus:outline-none focus:border-gray-700 focus:shadow-none"
                    type="number"
                    value={values[getAttr(e)][j - 1] || ""}
                    onChange={(event) =>
                      handleValueChange(
                        getAttr(e),
                        j - 1,
                        event.target.value,
                        e > 2 ? 12 : 10
                      )
                    }
                  />
                ))}
                <input
                  disabled
                  value={sumRow(getAttr(e))}
                  className="border w-20 focus:outline-none focus:border-gray-700 focus:shadow-none"
                  type="number"
                />
              </div>
            </div>
          ))}
          <input
            disabled
            value={sumValues()}
            className="float-right border w-20 focus:outline-none focus:border-gray-700 focus:shadow-none"
            type="number"
          />
        </div>
        <div className="flex flex-col pl-4 space-y-2">
          <div
            onClick={() => setGun("pistol")}
            className={
              " flex flex-col items-center cursor-pointer rounded-lg px-1 " +
              (gun === "pistol"
                ? "bg-blue-gray-600 text-white"
                : "bg-transparent text-blue-gray-600")
            }
          >
            <span>Pistola</span>
            <Image
              src={require(`../../app/assets/pistol${
                gun === "pistol" ? "_dark" : ""
              }.png`)}
              alt="pistol"
              height={60}
              width={60}
            />
          </div>
          <div
            onClick={() => setGun("revolver")}
            className={
              " flex flex-col items-center cursor-pointer rounded-lg px-1 " +
              (gun === "revolver"
                ? "bg-blue-gray-600 text-white"
                : "bg-transparent text-blue-gray-600")
            }
          >
            <span>Revolver</span>

            <Image
              src={require(`../../app/assets/revolver${
                gun === "revolver" ? "_dark" : ""
              }.png`)}
              alt="revolver"
              height={60}
              width={60}
            />
          </div>
        </div>
      </div>
      <div className="text-right mb-4">
        <button
          disabled={!gun}
          onClick={() => onSubmit()}
          className="bg-blue-gray-500 px-4 py-2 rounded-lg text-white disabled:bg-blue-gray-200 disabled:text-gray-600"
        >
          Salvar resultado
        </button>
      </div>
    </>
  );
};

export default FogoCentral;
