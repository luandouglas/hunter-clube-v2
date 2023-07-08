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

const SM22Precisao: React.FC<Props> = ({
  onSubmitExam,
  shooter,
  dateEvent,
  examId,
}) => {
  const [values, setValues] = React.useState<any>({
    first: [false, false, false, false, false, 0, 0, 0, 0, 0],
    second: [false, false, false, false, false, 0, 0, 0, 0, 0],
    third: [false, false, false, false, false, 0, 0, 0, 0, 0],
  });

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

  const sumRow = (ind: string) => {
    const row: (number | null)[] = values[ind];
    const filteredRow = row.filter(
      (num): num is number => num !== null && num !== undefined
    );
    const sum = filteredRow.reduce((acc: any, num: any) => acc + num, 0);

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

  const sumValues = () => {
    let sum = 0;
    for (let i = 0; i < values.first.length; i++) {
      sum +=
        (values.first[i] || 0) +
        (values.second[i] || 0) +
        (values.third[i] || 0);
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

  const handleCheckedChange = (
    individual: string,
    index: number,
    newValue: boolean
  ): void => {
    setValues((prevValues: any) => {
      const updatedValues = { ...prevValues };
      updatedValues[individual] = [
        ...prevValues[individual].slice(0, index),
        newValue,
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
    if (checkLevel(object, newDate)) {
      return object!.level!;
    } else if (object && object.level && object.firstRankingDate === newDate) {
      if (object.pontuation <= 149) {
        return "beginner";
      } else if (object.pontuation <= 169) {
        return "master";
      } else {
        return "super-master";
      }
    } else {
      if (sumValues() <= 149) {
        return "beginner";
      } else if (sumValues() <= 169) {
        return "master";
      } else {
        return "super-master";
      }
    }
  };

  const onSubmit = (): void => {
    onSubmitExam({
      points: values,
      pointsCounter: countPoints(values),
      total: sumValues(),
      level: adjustLevel(level, dateEvent),
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
    }
  };

  return (
    <>
      <div className="flex flex-row items-center">
        <div>
          {[1, 2, 3].map((e) => (
            <div key={e}>
              <div className="flex flex-row items-center">
                <span className="w-24">{e}ª Serie</span>
                <div>
                  {e === 1 && (
                    <div className="w-14 h-[42px] px-2 flex justify-center items-center border border-gray-400">
                      Porco
                    </div>
                  )}
                  {e === 2 && (
                    <div className="w-14 h-[42px] px-2 flex justify-center items-center border border-gray-400">
                      Peru
                    </div>
                  )}
                  {e === 3 && (
                    <div className="w-14 h-[42px] px-2 flex justify-center items-center border border-gray-400">
                      Bode
                    </div>
                  )}
                </div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((j) =>
                  j < 6 ? (
                    <div
                      className="border border-gray-400 w-14 h-[42px] flex justify-center items-center"
                      key={j}
                    >
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][j - 1] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            j - 1,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                  ) : (
                    <div
                      key={j}
                      className={
                        "border border-gray-400 w-14 h-[42px] flex justify-center items-center " +
                        (j === 6 ? "ml-6" : "")
                      }
                    >
                      <input
                        className="border w-20 focus:outline-none border-gray-400 focus:border-gray-700 focus:shadow-none"
                        type="number"
                        value={values[getAttr(e)][j - 1] || ""}
                        onChange={(event) =>
                          handleValueChange(
                            getAttr(e),
                            j - 1,
                            event.target.value,
                            12
                          )
                        }
                      />
                    </div>
                  )
                )}
                <input
                  disabled
                  value={sumRow(getAttr(e))}
                  className="border w-20 focus:outline-none border-gray-400 focus:border-gray-700 focus:shadow-none"
                  type="number"
                />
              </div>
            </div>
          ))}
          <input
            disabled
            value={sumValues()}
            className="float-right border w-20 focus:outline-none border-gray-400 focus:border-gray-700 focus:shadow-none"
            type="number"
          />
        </div>
      </div>

      <div className="text-right mb-4">
        <button
          onClick={() => onSubmit()}
          className="bg-blue-gray-500 px-4 py-2 rounded-lg text-white disabled:bg-blue-gray-200 disabled:text-gray-600"
        >
          Salvar resultado
        </button>
      </div>
    </>
  );
};

export default SM22Precisao;
