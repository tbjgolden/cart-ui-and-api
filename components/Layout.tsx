import Head from "next/head";
import Link from "next/link";
import { useFocusWithin } from "@react-aria/interactions";
import { useEffect, useState } from "react";
import BasketIcon from "./BasketIcon";

const LINKS = [
  {
    url: "/products",
    name: "Products",
  },
  {
    url: "/news",
    name: "News",
  },
  {
    url: "/contact",
    name: "Contact",
  },
  {
    url: "/basket",
    name: "🧺",
  },
];

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isMobile, setIsMobile] = useState(
    globalThis?.matchMedia?.("(max-width: 768px)")?.matches ?? false
  );

  const [isFocusWithin, setFocusWithin] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  });

  useEffect(() => {
    const isMobile = matchMedia("(max-width: 768px)");
    const listener = ({ matches }: { matches: boolean }) => {
      setIsMobile(matches);
    };
    isMobile.addEventListener("change", listener);
    return () => {
      isMobile.removeEventListener("change", listener);
    };
  }, []);

  return (
    <>
      <Head>
        <title>💡 My App</title>
      </Head>

      <nav id="nav">
        <div id="logo">
          <Link href="/">
            <a>APPS</a>
          </Link>
        </div>

        {isMobile ? (
          <>
            <div
              className="dd-backdrop"
              style={{
                display: isFocusWithin ? "block" : "none",
              }}
              tabIndex={0}
            />
            <div id="mobile-menu" {...focusWithinProps}>
              <button className="dd-button">
                Menu <span className="dd-menu-icon">☰</span>
              </button>
              {isFocusWithin ? (
                <div className="dd">
                  {LINKS.map(({ url, name }) => (
                    <Link href={url}>
                      <a className="dd-item">
                        {name === "🧺" ? (
                          <span style={{ fontSize: "120%" }}>
                            <BasketIcon />
                          </span>
                        ) : (
                          name
                        )}
                      </a>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div id="desktop-menu">
            {LINKS.map(({ url, name }) => (
              <Link href={url}>
                <a className="menu-item">
                  {name === "🧺" ? (
                    <span style={{ fontSize: "120%" }}>
                      <BasketIcon />
                    </span>
                  ) : (
                    name
                  )}
                </a>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {children}

      <footer id="footer">
        <p>
          This take home developer exercise could really benefit from being less
          time consuming.
        </p>
        <p>
          Realistically, 3 hours of max efficiency work is the longest a take
          home should take to measure a candidate's ability - this is more like
          9-10 hours.
        </p>
      </footer>
    </>
  );
};
