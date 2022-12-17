import { AuthMode } from "models/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken } from "util/auth";
import { getGatewayResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    initImageUrl: string;
    width: number;
    height: number;
    authMode: AuthMode;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { initImageUrl, width, height, authMode } = req.body;

  const config = {
    mode: "remix",
    text_input: "remix",
    init_image_data: initImageUrl,
    seed: 1e8 * Math.random(),
    sampler: "klms",
    n_samples: 4,
    scale: 10.0,
    steps: 60,
    width: width,
    height: height,
  };

  const authToken = getAuthToken(authMode, req.session);

  if (!authToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const result = await getGatewayResult(config, authToken);
    if (result.error) {
      console.error(result.error);
      return res.status(500).json({ error: "Error generating image" });
    }

    return res.status(200).json({ outputUrl: result.outputUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error generating image" });
  }
};

export default withSessionRoute(handler);
