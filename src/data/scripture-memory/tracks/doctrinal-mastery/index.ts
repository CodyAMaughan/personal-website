import { BOOK_OF_MORMON_TRACK } from "./book-of-mormon";
import { DOCTRINE_AND_COVENANTS_TRACK } from "./doctrine-and-covenants";
import { NEW_TESTAMENT_TRACK } from "./new-testament";
import { OLD_TESTAMENT_TRACK } from "./old-testament";

export const DOCTRINAL_MASTERY_TRACKS = [
  OLD_TESTAMENT_TRACK,
  NEW_TESTAMENT_TRACK,
  BOOK_OF_MORMON_TRACK,
  DOCTRINE_AND_COVENANTS_TRACK,
];

export const DOCTRINAL_MASTERY_PLAN = {
  id: "doctrinal-mastery",
  title: "Doctrinal Mastery",
  description: "96 doctrinal mastery passages organized by scripture year.",
  trackIds: DOCTRINAL_MASTERY_TRACKS.map((track) => track.id),
};
