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

const PercursoCaca: React.FC<Props> = ({
  onSubmitExam,
  shooter,
  dateEvent,
  examId,
}) => {
  const [values, setValues] = React.useState<any>({
    first: [false, false, false, false, false],
    second: [false, false, false, false, false],
    third: [false, false, false, false, false],
    fourth: [false, false, false, false, false],
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
        (values.third[i] || 0) +
        (values.fourth[i] || 0);
    }
    return sum;
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
      if (object.pontuation <= 12) {
        return "beginner";
      } else {
        return "master";
      }
    } else {
      if (sumValues() <= 12) {
        return "beginner";
      } else {
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
        <div className="flex flex-row space-x-3 text-center">
          {[1, 2, 3, 4].map((e) => (
            <div key={e}>
              <span className="w-24">{e}ª Serie</span>
              <div className="flex flex-row items-center">
                <div className="flex flex-col">
                  <div className="border border-gray-400 w-auto h-[42px] flex justify-center items-center">
                    <input
                      className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                      type="checkbox"
                      value={values[getAttr(e)][0] || ""}
                      onChange={(event) =>
                        handleCheckedChange(getAttr(e), 0, event.target.checked)
                      }
                    />
                  </div>
                  <div className="flex flex-row">
                    <div className="border border-gray-400 w-14 h-[42px] flex justify-center items-center">
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][1] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            1,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                    <div className="border border-gray-400 w-14 h-[42px] flex justify-center items-center">
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][2] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            2,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="border border-gray-400 w-14 h-[42px] flex justify-center items-center">
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][3] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            3,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                    <div className="border border-gray-400 w-14 h-[42px] flex justify-center items-center">
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][4] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            4,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <input
            disabled
            value={sumValues()}
            className="self-end border h-min w-20 focus:outline-none border-gray-400 focus:border-gray-700 focus:shadow-none"
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

export default PercursoCaca;
