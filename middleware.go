package main

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/context"
	"github.com/gorilla/sessions"
	"github.com/nu7hatch/gouuid"
)

type contextKey string

const (
	sessionKey contextKey = "session"
)

func GetReqSession(req *http.Request) *sessions.Session {
	if v := context.Get(req, sessionKey); v != nil {
		return v.(*sessions.Session)
	}
	return nil
}

func SetReqSession(req *http.Request, v *sessions.Session) {
	context.Set(req, sessionKey, v)
}

func sessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		session, err := store.Get(req, "session-key")
		if err != nil {
			log.Println(err.Error())
		}

		SetReqSession(req, session)

		// Set a cookie for user's level progress
		if v, ok := session.Values["level_progress"]; ok {
			if b, err := json.Marshal(v); err != nil {
				log.Println(err.Error())
			} else {
				// Since it's a cookie, we have to encode it manually
				// so the client can safely decode and json parse
				str := base64.StdEncoding.EncodeToString(b)
				cookie := sessions.NewCookie("UserLevelProgress", str, &sessions.Options{})
				http.SetCookie(w, cookie)
			}
		}

		next.ServeHTTP(w, req)
	})
}

func analyticsUUIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		session := GetReqSession(req)

		// Assign a analytics id if none exists
		var analyticsID string
		if v, ok := session.Values["analytics-id"]; ok {
			analyticsID = v.(string)
		} else {
			if u, err := uuid.NewV4(); err != nil {
				log.Println("Error creating uuid:", err)
			} else {
				analyticsID = u.String()
				session.Values["analytics-id"] = analyticsID
			}
		}

		// Set as a cookie
		cookie := sessions.NewCookie("analyticsID", analyticsID, &sessions.Options{})
		http.SetCookie(w, cookie)

		if err := session.Save(req, w); err != nil {
			log.Println("Error saving session", err.Error())
		}

		next.ServeHTTP(w, req)
	})
}
