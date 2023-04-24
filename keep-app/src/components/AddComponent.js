import { useState } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import TextareaAutosize from "react-textarea-autosize";
import { RiDeleteBin2Fill } from "react-icons/ri";
import "../App.css";

export const FormNote = ({ note, setNote }) => {
	return (
		<div className="p-1 flex flex-col h-fit text-slate-700">
			<TextareaAutosize
				name="title"
				className="resize-none overflow-hidden whitespace-pre-wrap mt-3 px-2 text-xl font-semibold bg-inherit focus:outline-none border-b-2 border-[#76abe8] h-[1.76rem]"
				placeholder="Title"
				value={note.title}
				onChange={(e) => {
					setNote({ ...note, title: e.target.value });
				}}></TextareaAutosize>
			<TextareaAutosize
				name="note"
				type="text"
				placeholder="Your Note  . . ."
				className="mt-2 bg-inherit p-2 min-h-fit focus:outline-none resize-none overflow-hidden whitespace-pre-wrap"
				value={note.text}
				onChange={(e) => {
					setNote({ ...note, text: e.target.value });
				}}></TextareaAutosize>
		</div>
	);
};

export const FormTodo = ({ todo, setTodo }) => {
	let [listItemText, setListItemText] = useState("");

	return (
		<div className="p-1 flex flex-col h-fit text-slate-700">
			<TextareaAutosize
				name="title"
				className="mt-3 px-2 text-xl font-semibold bg-inherit focus:outline-none border-b-2 border-spacing-2 border-[#76abe8] resize-none overflow-hidden whitespace-pre-wrap h-[1.76rem]"
				placeholder="Title"
				value={todo.title}
				onClick={(e) => (e.target.style.height = `${e.target.scrollHeight}px`)}
				onChange={(e) => {
					setTodo({ ...todo, title: e.target.value });
				}}></TextareaAutosize>
			<ul className="flex flex-col my-4 marker:text-gray-400 marker:text-2xl list-disc w-[75%] mx-auto">
				{todo.list.map((item, index) => (
					<li
						key={index}
						className="bg-transparent border-b-2 border-[#76abe8] items-center justify-center">
						<div className="flex items-center justify-center">
							<TextareaAutosize
								className="bg-inherit focus:outline-none mr-2 flex-1 break-words resize-none overflow-hidden whitespace-pre-wrap"
								value={item.text}
								onChange={(e) => {
									todo.list[index] = { done: false, text: e.target.value };
									setTodo({ ...todo });
								}}></TextareaAutosize>
							<button
								type="button"
								className="m-1 p-1 rounded-lg hover:bg-[#fba0a0] bg-[#a0ccff] group hover:scale-125 hover:shadow-md h-min mr-2 my-auto"
								onClick={() => {
									const newTodoList = [...todo.list];
									newTodoList.splice(index, 1);
									setTodo({ ...todo, list: newTodoList });
								}}>
								<RiDeleteBin2Fill
									size={15}
									className=" text-[#408de6] group-hover:text-[#ff0000]"
								/>
							</button>
						</div>
					</li>
				))}
				<li className="bg-transparent border-b-2 border-[#76abe8] ">
					<div className="flex align-middle">
						<TextareaAutosize
							className="bg-inherit focus:outline-none mr-2 flex-1 break-words resize-none overflow-hidden whitespace-pre-wrap"
							placeholder="List Item  . . ."
							value={listItemText}
							onKeyDown={(e) => {
								if (e.code === "Enter") {
									setTodo({
										...todo,
										list: todo.list.concat([
											{ text: listItemText, done: false },
										]),
									});
									setListItemText("");
								}
							}}
							onChange={(e) => {
								setListItemText(e.target.value);
							}}></TextareaAutosize>
					</div>
				</li>
			</ul>
		</div>
	);
};

export const AddComponent = ({ onAddComponent }) => {
	const clearComponent = {
		type: "note",
		title: "",
		pinned: false,
		text: "",
		list: [],
	};

	let [toggleForm, setToggleForm] = useState(false);
	let [formType, setFormType] = useState("note");
	let [component, setComponent] = useState(clearComponent);
	const publishComponent = (formType) => {
		if (
			component.text === "" &&
			component.title === "" &&
			component.list === []
		)
			return;
		let newComponent = {
			_id: Date.now(),
			type: formType,
			title: component.title,
			pinned: false,
			date: new Date(new Date().getTime() + 330 * 60 * 1000),
		};
		if (formType === "note")
			newComponent = { ...newComponent, text: component.text };
		else newComponent = { ...newComponent, list: component.list };
		onAddComponent(newComponent);
		setComponent(clearComponent);
		setFormType("note");
		setToggleForm(!toggleForm);
	};

	return (
		<div className="flex flex-col lg:w-[700px] lg:p-0 md:w-[600px] md:p-0 sm:w-[500px] sm:p-0 w-[100%] px-4 mb-2 justify-center mx-auto">
			<button
				type="button"
				className={`Note-Width flex w-[100%] h-10 bg-[#76abe8] mx-auto justify-center select-none focus:outline-none hover:scale-105 ${
					toggleForm ? "rounded-t-lg" : "rounded-lg"
				} shadow-xl`}
				onClick={() => setToggleForm(!toggleForm)}>
				<MdPlaylistAdd
					size={40}
					color="white"
				/>
			</button>
			{toggleForm && (
				<div className="w-[100%] h-fit mx-auto rounded-b-lg shadow-xl bg-[#ccd4de] px-4 flex flex-col">
					<div className="flex justify-center mx-auto my-4">
						<h1 className="font-bold text-2xl mx-4 text-gray-500">Note</h1>
						<div className="my-auto relative inline-block w-10 align-middle select-none transition duration-1000 ease-in">
							<input
								type="checkbox"
								name="toggle"
								id="toggle"
								className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-[#76abe8] border-4 appearance-none cursor-pointer focus:outline-none"
								onClick={() => {
									if (formType === "note") setFormType("todo");
									else setFormType("note");
									setComponent({ ...component, type: formType });
								}}
							/>
							<label
								htmlFor="toggle"
								className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer bg-slate-400"></label>
						</div>
						<h1 className="font-bold text-2xl mx-4 text-gray-500">Todo</h1>
					</div>
					{formType === "note" ? (
						<FormNote
							note={component}
							setNote={setComponent}
						/>
					) : (
						<FormTodo
							todo={component}
							setTodo={setComponent}
						/>
					)}
					<div className="flex justify-between">
						<button
							type="button"
							className="bg-[#76abe8] text-white hover:scale-105 hover:shadow-md rounded-md py-1 px-3 my-2 mr-auto ml-1"
							onClick={() => {
								setToggleForm(false);
								setComponent(clearComponent);
								setFormType("note");
							}}>
							cancel
						</button>
						<button
							type="button"
							className="bg-[#76abe8] text-white hover:scale-105 hover:shadow-md rounded-md py-1 px-3 my-2 mr-1 ml-auto"
							onClick={() => {
								publishComponent(formType);
							}}>
							Submit
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
