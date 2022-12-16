import { NextApiRequest, NextApiResponse } from "next";
import { getGatewayResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    prompt1: string;
    prompt2: string;
    width: number;
    height: number;
    numFrames: number;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { prompt1, prompt2, width, height, numFrames } = req.body;

  const interpolation_texts = [prompt1, prompt2];

  const config = {
    mode: "interpolate",
    stream: true, // this doesn't do anything yet
    stream_every: 1, // this doesn't do anything yet
    text_input: `${prompt1}_to_${prompt2}`,
    seed: 1e8 * Math.random(),
    sampler: "euler",
    scale: 10.0,
    steps: 25,
    width: width,
    height: height,
    n_frames: numFrames,
    loop: true,
    smooth: true,
    n_film: 1,
    scale_modulation: 0.2,
    fps: 12,
    interpolation_texts: interpolation_texts,
    interpolation_seeds: [1e8 * Math.random(), 1e8 * Math.random()],
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
