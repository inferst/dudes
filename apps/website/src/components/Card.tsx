import { JSX } from 'react';

type CardProps = {
  icon: JSX.Element;
  title: string;
  description: string;
};

export const Card = (props: CardProps) => {
  return (
    <>
      <div className="bg-card-1 p-8 rounded-2xl border-1 border-card-border items-center flex flex-col">
        <div className="border-gray-400 border-2 p-4 rounded-[100%]">
          {props.icon}
        </div>
        <div className="text-3xl font-bold py-4">{props.title}</div>
        <div className="text-xl mt-2">{props.description}</div>
      </div>
    </>
  );
};
