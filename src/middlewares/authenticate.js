import createHttpError from "http-errors";
import User from "../db/models/user.js";
import Session from "../db/models/session.js";

//kimlik doğrulama, oturum kontrolü, route kontrolü
export const authenticate = async (req, res, next) => {
  try {
    //login olup olmadığını kontrol ediyoruz
    const { sessionId } = req.cookies;

    if (!sessionId) return next(createHttpError(401, "Login olmanız gerekli"));

    //login olsa bile token'la ilgili sıkıntı olup oturum başlamamış olabilir.Bu durumu kontrol ediyoruz
    const session = await Session.findById(sessionId);

    if (!session) return next(createHttpError(401, "Geçersiz oturum"));

    //accessToken'ı varmı? yada süresi dolmuş mu bunu kontrol ediyoruz
    if (new Date() > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, "Oturum süresi dolmuş"));
    }

    //kullanıcı var mı onu kontrol ediyoruz
    const user = await User.findById(session.userId);

    if (!user) return next(createHttpError(401, "Kullanıcı bulunamadı"));

    req.user = user;
    req.sessionId = session;
    next();
  } catch (error) {
    next(createHttpError(500, "Kimlik doğrulama hatası/Sunucu hatası"));
  }
};
