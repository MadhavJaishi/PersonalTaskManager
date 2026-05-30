import supabase from "../../utils/supabase.js";

export async function authMiddleware(req, res, next) {
    const access = req.cookies.sb_access;
    const refresh = req.cookies.sb_refresh;

    if (!access && !refresh) {
        return res.status(401).json({ error: "Not Authencated" });
    }

    const { data: accessData } = await supabase.auth.getUser(access);

    if (accessData?.user) {
        req.user = accessData.user;
        return next();
    }

    if (refresh) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refresh });
        if (refreshError) {
            return res.status(401).json({ error: "Session Expired" });
        }

        const newSession = refreshData.session;

        res.cookie("sb_access", newSession.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 4,
        })
        res.cookie("sb_refresh", newSession.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30,
        })
        req.user = refreshData.session.user;
        return next();
    }
    return res.status(401).json({ error: "Not Authenticated" })
}