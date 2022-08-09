import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import ReactLoading from "react-loading";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../fire";

export default function AdminRoute(props) {
	const [user, setUser] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (use) => {
			setUser(use);
			setLoading(false);
		});
	}, [user]);

	return (
		<>
			{loading ? (
				<div style={{ position: "fixed", top: "45%", left: "45%" }}>
					<ReactLoading
						type="spinningBubbles"
						color="#000"
						style={{ width: "50px", height: "50px" }}
					/>
				</div>
			) : user != null ? (
				user.emailVerified ? (
					user.photoURL === user.uid ? (
						<Route component={props.component} exact path={props.path} />
					) : (
						<Redirect
							to={{
								pathname: "/",
								state: {
									alert: true,
									severity: "error",
									message: "You are not an admin.",
								},
							}}
						/>
					)
				) : (
					<Redirect
						to={{
							pathname: "/",
							state: {
								alert: true,
								severity: "error",
								message: "Please verify your email address.",
							},
						}}
					/>
				)
			) : (
				<Redirect
					to={{
						pathname: "/",
						state: {
							alert: true,
							severity: "error",
							message: "Please sign in.",
						},
					}}
				/>
			)}
		</>
	);
}
