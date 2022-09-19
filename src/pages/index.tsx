import type { NextPage } from "next";
import Head from "next/head";
import { RiLockPasswordFill, RiSaveFill } from "react-icons/ri";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";

type Inputs = {
  title: string;
  text: string;
  password: string | null;
};

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const [isSubmitting, setSubmitting] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setSubmitting(true);
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>md-notes</title>
        <meta
          name="description"
          content="Save notes in markdown format to share with others!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)}>
          <header className="items-center flex flex-row justify-between p-4 border-b border-white/10">
            {/* Title */}
            <input
              id="title"
              type="text"
              placeholder="md-notes"
              className="w-auto bg-transparent font-medium focus:outline-none"
              required
              maxLength={50}
              {...register("title", { required: true })}
            />

            <div className="ml-2 flex flex-row space-x-2">
              <button className="primary-btn">
                <RiLockPasswordFill className="inline-block" />
                <span className="ml-2">password</span>
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Image
                    alt="loading icon"
                    src="/assets/svg/loading.svg"
                    width={15}
                    height={15}
                  />
                ) : (
                  <div>
                    <RiSaveFill className="inline-block" />
                    <span className="ml-2">save</span>
                  </div>
                )}
              </button>
            </div>
          </header>
          <textarea
            required
            id="text"
            placeholder="Enter your notes here..."
            className="min-w-full p-4 bg-[#101013] focus:outline-none text-white/70 "
            {...register("text", { required: true })}
          />
        </form>
      </main>
    </>
  );
};

export default Home;