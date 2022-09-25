import type { NextPage } from "next";
import Head from "next/head";
import { RiLockPasswordFill, RiSaveFill } from "react-icons/ri";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import Modal from "../components/Password";
import toast from "react-hot-toast";

type Inputs = {
  title: string;
  content: string;
  password: string | null;
};

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { register, handleSubmit } = useForm<Inputs>();
  const [isSubmitting, setSubmitting] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setSubmitting(true);

    /* Send a POST request to the API */
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } p-4 border bg-[#202028]/20 backdrop-blur-xl border-[#4a4a4a]/10 shadow-lg rounded-lg pointer-events-auto flex flex-row items-center`}
          >
            <div className="flex flex-row items-center opacity-50">
              <p className="text-sm">note created</p>
            </div>
          </div>
        ));

        // Redirect to the note
        window.location.href = `/${data.id}`;
      });
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

      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        next={(password: string) => setPassword(password)}
      />

      <main className="flex flex-col bg-[#101013]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <header className="items-center flex flex-row justify-between p-4">
            {/* Title */}
            <input
              type="text"
              placeholder="md-notes"
              className="w-auto bg-transparent font-medium focus:outline-none"
              required
              maxLength={50}
              {...register("title", { required: true })}
            />

            <div className="pr-[1vw] sm:pr-0 flex flex-row space-x-2">
              <button
                type="button"
                className="primary-btn"
                onClick={() => setIsModalOpen(true)}
              >
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
                  <div className="flex flex-row items-center">
                    <RiSaveFill className="inline-block" />
                    <span className="ml-2">save</span>
                  </div>
                )}
              </button>
            </div>
          </header>

          <hr className="border-[0.5] border-neutral-800" />

          <textarea
            required
            placeholder="Enter your notes here..."
            className="font-mono min-h-[92.14vh] min-w-full p-4 bg-[#101013] focus:outline-none text-white/70 "
            {...register("content", { required: true })}
          />
        </form>
      </main>
    </>
  );
};

export default Home;