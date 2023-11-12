function Header() {
    return (
        <div
          style={{
            position: "relative",
            backgroundColor: "#fff",
            width: "100%",
            height: "305px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              height: "87.3%",
              width: "88.81%",
              top: "6.35%",
              right: "5.6%",
              bottom: "6.35%",
              left: "5.6%",
              borderRadius: "32px",
              backgroundColor: "#29292b",
              boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.75)",
            }}
          />
          <div
            style={{
              position: "absolute",
              height: "71.38%",
              top: "14.09%",
              bottom: "14.53%",
              left: "42px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                zIndex: "0",
              }}
            >
              <img
                style={{
                  position: "relative",
                  borderRadius: "0.94px",
                  width: "33.42px",
                  height: "33.98px",
                }}
                alt=""
                src="/images/g.svg"
              />
              <img
                style={{
                  position: "relative",
                  borderRadius: "0.94px",
                  width: "25.88px",
                  height: "32.81px",
                }}
                alt=""
                src="/images/t.svg"
              />
              <img
                style={{
                  position: "relative",
                  borderRadius: "0.94px",
                  width: "30.47px",
                  height: "32.81px",
                }}
                alt=""
                src="/images/h.svg"
              />
              <img
                style={{
                  position: "relative",
                  borderRadius: "0.94px",
                  width: "33.42px",
                  height: "33.98px",
                }}
                alt=""
                src="/images/g1.svg"
              />
            </div>
            <img
              style={{
                position: "absolute",
                margin: "0",
                height: "100%",
                top: "0%",
                bottom: "0%",
                left: "40px",
                borderRadius: "152px",
                maxHeight: "100%",
                width: "6px",
                zIndex: "1",
              }}
              alt=""
              src="/images/rectangle-17.svg"
            />
          </div>
        </div>
      );
}

export default Header;