import { NextApiRequest, NextApiResponse } from "next";
import { getGatewayResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    initImageUrl: string;
    width: number;
    height: number;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { initImageUrl, width, height } = req.body;

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

  if (!req.session.authToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const result = await getGatewayResult(config, req.session.authToken);
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
