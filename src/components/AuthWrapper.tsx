import { withSessionSsr } from "util/withSession";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const authToken = req.session.authToken;

    return {
      props: {
        authToken: req.session.authToken,
      },
    };
  }
);

export default function AuthWrapper({ children, authToken }) {
  return <div>{children}</div>;
}
