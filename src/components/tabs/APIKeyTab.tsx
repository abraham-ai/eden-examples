import { Button, Form, Input } from "antd";
import axios from "axios";
import { useState } from "react";

interface APIKeyFormInputs {
  apiKey: string;
  apiSecret: string;
}

const APIKeyTab = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const initialValues: APIKeyFormInputs = {
    apiKey: "",
    apiSecret: "",
  };

  const handleAuthenticate = async (values: APIKeyFormInputs) => {
    setAuthenticating(true);
    try {
      await axios.post("/api/auth/key", values);
      setMessage("Successfully authenticated");
    } catch (error) {
      setMessage("Error authenticating");
    }
    setAuthenticating(false);
  };
  return (
    <>
      <Form
        name="api-key"
        initialValues={initialValues}
        onFinish={handleAuthenticate}
      >
        <Form.Item label="API Key" name="apiKey">
          <Input />
        </Form.Item>
        <Form.Item label="API Secret" name="apiSecret">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={authenticating}
            disabled={authenticating}
          >
            Authenticate Keypair
          </Button>
        </Form.Item>
      </Form>
      {message && <p>{message}</p>}
    </>
  );
};

export default APIKeyTab;
