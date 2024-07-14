

const auth =async (req, res, next) => {

    const api_token = req.headers.authorization?.split(' ')[1];
    if (!api_token) {
         res.status(401).json({ status: 401, message: "token invalid or expaired" });
         return;
    }
    try {

    if (!api_token === "kUZPhkE_wtN3aufMwj$A") {
      res.status(401).json({ status: 401, message: "token invalid or expaired" });
    }

        next();

    } catch (error) {
         res.status(401).json({ status: 401, message: "token invalid or expaired" });
    }
};

export default auth;