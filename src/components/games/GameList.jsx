import { IoMdCodeDownload } from "react-icons/io";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../config/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../modal/Modal";
import { modalFunc } from "../../redux/modalSlice";
import GamesTableThComp from "./GamesTableThComp";
import { gameListThElements } from "../../utils/GameListThElements";
import Searching from "./Searching";
import { getGames } from "../../redux/gameSlice";
import GameTableRow from "./GameTableRow";
import { Tooltip } from "react-tooltip";
import GameTableRowSkeleton from "../skeleton/GameTableRowSkeleton";

const GameList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const pathName = location.pathname.split("/")[1];
  const userPathId = location.pathname.split("/")[2];
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get("search");
  const gamesRef = collection(db, "games");

  //* States
  const [filterValue, setFilterValue] = useState("-gameDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [user, setUser] = useState({});

  //* Redux States
  const games = useSelector((state) => state.games.games);
  const token = useSelector((state) => state.auth.token);
  const modal = useSelector((state) => state.modal.modal);
  const searchedGames = useSelector((state) => state.games.searchedGames);

  //prettier-ignore
  const [gameInfo, setGameInfo] = useState({ name: "", gamePhoto: "", score: 0, platform: "Steam", date: "", review: "", gameStatus: "Bitirildi", gameTotalTime: 0});
  const editGameInfo = (index) => {
    dispatch(modalFunc());
    if (searchParam) {
      setGameInfo({
        name: searchedGames[index].gameName,
        gamePhoto: searchedGames[index].gamePhoto,
        score: searchedGames[index].gameScore,
        platform: searchedGames[index].gamePlatform,
        date: searchedGames[index].gameDate,
        review: searchedGames[index].gameReview,
        gameStatus: searchedGames[index].gameStatus,
        gameTotalTime: searchedGames[index].gameTotalTime,
        dateEnd: searchedGames[index].dateEnd,
      });
      navigate(`?search=${searchParam}&edit=${searchedGames[index].id}`);
    } else {
      setGameInfo({
        name: games[index].gameName,
        gamePhoto: games[index].gamePhoto,
        score: games[index].gameScore,
        platform: games[index].gamePlatform,
        date: games[index].gameDate,
        review: games[index].gameReview,
        gameStatus: games[index].gameStatus,
        gameTotalTime: games[index].gameTotalTime,
        dateEnd: games[index].dateEnd,
      });
      navigate(`?edit=${games[index].id}`);
    }
  };

  const fetchUser = async () => {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);
    const foundUser = querySnapshot.docs.find((doc) => doc.data().uid === userPathId);
    setUser(foundUser.data());
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    dispatch(getGames([]));
    let fieldToOrderBy;
    switch (filterValue) {
      case "gameName":
        fieldToOrderBy = "gameName";
        break;
      case "gameScore":
        fieldToOrderBy = "gameScore";
        break;
      case "gamePlatform":
        fieldToOrderBy = "gamePlatform";
        break;
      case "screenshots":
        fieldToOrderBy = "screenshots";
        break;
      case "gameTotalTime":
        fieldToOrderBy = "gameTotalTime";
        break;
      case "gameDate":
        fieldToOrderBy = "gameDate";
        break;
      case "gameStatus":
        fieldToOrderBy = "gameStatus";
        break;
      default:
        fieldToOrderBy = filterValue.slice(1);
    }
    setSortOrder(filterValue.charAt(0) === "-" ? "desc" : "asc");

    const querryMessages = query(gamesRef, where("userId", "==", userPathId), orderBy(fieldToOrderBy, sortOrder));
    const unsuscribe = onSnapshot(querryMessages, (snapshot) => {
      const updatedGames = [];
      snapshot.forEach((doc) => {
        updatedGames.push({ ...doc.data(), id: doc.id });
      });
      updatedGames.length === 0 ? dispatch(getGames("Empty")) : dispatch(getGames(updatedGames));
    });
    return () => unsuscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue, pathName, userPathId, sortOrder]);

  const filterDatas = (e) => {
    const clickedValue = e.target?.innerText;
    if (clickedValue) {
      const lowerClickedValue = clickedValue.toLowerCase();
      setFilterValue((prevFilterValue) => {
        if (lowerClickedValue === "oyun") {
          return prevFilterValue === "gameName" ? "-gameName" : "gameName";
        }
        if (lowerClickedValue === "puan") {
          return prevFilterValue === "gameScore" ? "-gameScore" : "gameScore";
        }
        if (lowerClickedValue === "platform") {
          return prevFilterValue === "gamePlatform" ? "-gamePlatform" : "gamePlatform";
        }
        if (lowerClickedValue === "ss") {
          return prevFilterValue === "screenshots" ? "-screenshots" : "screenshots";
        }
        if (lowerClickedValue === "saat") {
          return prevFilterValue === "gameTotalTime" ? "-gameTotalTime" : "gameTotalTime";
        }
        if (lowerClickedValue === "son oynama") {
          return prevFilterValue === "gameDate" ? "-gameDate" : "gameDate";
        }
        if (lowerClickedValue === "durum") {
          return prevFilterValue === "gameStatus" ? "-gameStatus" : "gameStatus";
        }
        return prevFilterValue;
      });
    }
  };

  const downloadGameData = () => {
    const jsonString = JSON.stringify(games, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "games.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  //* Loading
  if (games === "Empty") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Oyun bulunamadı</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <strong>{user.name}</strong> henüz oyun eklememiş
        </p>
        <div>{modal && <Modal setGameInfo={setGameInfo} gameInfo={gameInfo} />}</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div>{modal && <Modal setGameInfo={setGameInfo} gameInfo={gameInfo} searchParam={searchParam}></Modal>}</div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-xl font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          <div className="flex justify-between">
            <span>
              Oyunlar
              <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400 flex justify-between">
                <span>
                  <strong>{user.name}</strong> tarafından oynanılan tüm oyunlar
                </span>
              </p>
            </span>
            <div className="flex items-center space-x-3">
              {token && games.length !== 0 && userPathId === JSON.parse(token).uid && (
                <IoMdCodeDownload
                  size={35}
                  data-tooltip-id="download-data-tooltip"
                  data-tooltip-html="Oyun Verilerini JSON Olarak İndir"
                  className="hover:text-sky-800 duration-300 cursor-pointer"
                  onClick={downloadGameData}
                />
              )}
              <Tooltip id="download-data-tooltip" />
              <Searching />
            </div>
          </div>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            {gameListThElements.map((elementInfo, i) => (
              <GamesTableThComp
                filterDatas={filterDatas}
                filterValue={filterValue}
                key={i}
                elementInfo={elementInfo}
              ></GamesTableThComp>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.length === 0 ? (
            <GameTableRowSkeleton rowCount={7} />
          ) : (
            (searchParam ? searchedGames : games).map((game, index) => (
              <GameTableRow
                key={index}
                game={game}
                userPathId={userPathId}
                token={token}
                index={index}
                hoveredRow={hoveredRow}
                setHoveredRow={setHoveredRow}
                editGameInfo={editGameInfo}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GameList;
