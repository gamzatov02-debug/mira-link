import type { Metadata } from "next";
import { safeDemoReturnPath } from "@/lib/demo-auth/session";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Вход в закрытую демоверсию — MIRA LINK",
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const nextValue = Array.isArray(query.next) ? query.next[0] : query.next;
  const hasError = query.error === "1" || (Array.isArray(query.error) && query.error.includes("1"));
  const returnPath = safeDemoReturnPath(nextValue);

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="demo-login-title">
        <div className={styles.brand}>MIRA LINK</div>
        <p className={styles.eyebrow}>Private Demo</p>
        <h1 id="demo-login-title">Закрытая демоверсия</h1>
        <p className={styles.intro}>Доступ предоставляется участникам проекта.</p>
        <form className={styles.form} action="/demo/auth/login" method="post">
          <input type="hidden" name="next" value={returnPath} />
          {hasError && <p className={styles.error} role="alert">Неверный логин или пароль</p>}
          <label className={styles.field}>
            Логин
            <input name="username" type="text" autoComplete="username" required maxLength={64} />
          </label>
          <label className={styles.field}>
            Пароль
            <input name="password" type="password" autoComplete="current-password" required maxLength={1024} />
          </label>
          <button className={styles.submit} type="submit">Войти</button>
        </form>
        <p className={styles.note}>Доступ только для авторизованных пользователей</p>
      </section>
    </main>
  );
}
