import axiosInstance from "./axios";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @param {string} stdin - optional stdin input
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code, stdin = "") {
  try {
    const response = await axiosInstance.post("/code/execute", {
      language,
      code,
      stdin,
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
