"use client"

import { useEffect, useState } from "react"
import NavBar from "../../../components/Header/NavBar"
import SideBar from "../../../components/Sidebar/SideBar"
import BlogList from "../../../components/Blog/BlogList"
import TopAuthors from "../../../components/Author/TopAuthors"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

const Homepage = () => {
  const [blogs, setBlogs] = useState([])
  const [mostLikedBlogs, setMostLikedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [paginationLoading, setPaginationLoading] = useState(false)

  const fetchBlogs = async (page = 0, size = 6) => {
    const token = localStorage.getItem("token")
    setLoading(true)
    setPaginationLoading(true)

    try {
      console.log(`Fetching blogs for page: ${page}, size: ${size}`)
      const response = await fetch(`http://localhost:8080/api/posts?size=${size}&page=${page + 1}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched data:", data)
        setBlogs(data.content)
        // Remove setting currentPage from API response to avoid pagination loop
        setTotalPages(data.totalPages)
        console.log(`Current page requested: ${page}, Total pages: ${data.totalPages}`)
      } else {
        const errorData = await response.json()
        console.error("Lỗi khi lấy danh sách blog:", errorData.message)
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error)
    } finally {
      setLoading(false)
      setPaginationLoading(false)
    }
  }

  const fetchMostLikedBlogs = async () => {
    const token = localStorage.getItem("token")
    try {
      const mostLikedResponse = await fetch("http://localhost:8080/api/posts/most-liked", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (mostLikedResponse.ok) {
        const mostLikedData = await mostLikedResponse.json()
        setMostLikedBlogs(mostLikedData.content)
      } else {
        const errorData = await mostLikedResponse.json()
        console.error("Lỗi khi lấy bài blog được thích nhiều nhất:", errorData.message)
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error)
    }
  }

  const handlePageChange = (newPage) => {
    console.log(`Attempting to change to page: ${newPage}`)
    if (newPage >= 0 && newPage < totalPages) {
      console.log(`Changing to page: ${newPage}`)
      setCurrentPage(newPage)
      // Scroll to the All Blogs section when changing pages
      const allBlogsSection = document.getElementById("all-blogs-section")
      if (allBlogsSection) {
        allBlogsSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } else {
      console.log(`Invalid page number: ${newPage}, totalPages: ${totalPages}`)
    }
  }

  useEffect(() => {
    fetchBlogs(currentPage, pageSize)
  }, [currentPage, pageSize])

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess")
    if (loginSuccess === "true") {
      setShowMessage(true)
      localStorage.removeItem("loginSuccess")

      // Auto-hide the message after 3 seconds
      const timer = setTimeout(() => {
        setShowMessage(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Refresh blogs if a new post was created
  useEffect(() => {
    const newPostCreated = localStorage.getItem("newPostCreated")
    if (newPostCreated === "true") {
      fetchBlogs(currentPage, pageSize)
      localStorage.removeItem("newPostCreated")
    }
  }, [])

  useEffect(() => {
    fetchMostLikedBlogs()
  }, [])

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(searchTerm.toLowerCase()))

  // Calculate visible page range
  const getVisiblePageRange = () => {
    const delta = 1 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 || // First page
        i === totalPages - 1 || // Last page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
      ) {
        range.push(i)
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push("...")
        }
      }
      rangeWithDots.push(i)
      l = i
    }

    return rangeWithDots
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <NavBar
          setSearchTerm={setSearchTerm}
          resetPage={() => {
            setCurrentPage(0)
          }}
        />
      </header>

      {/* Sidebar and Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900 w-60 z-40 shadow-lg">
          <SideBar />
        </aside>

        {/* Main Content */}
        <div className="ml-60 flex-grow p-6">
          {/* Success Message */}
          {showMessage && (
            <div className="fixed top-20 right-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fade-in-out">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-medium">Login successfully!</p>
              </div>
            </div>
          )}

          {/* Hero Banner Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl shadow-xl mb-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 py-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Diverse Perspectives of the Young Generation in Vietnam
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-blue-100 mb-8">
                Write - Share - Connect - Reflect
                <br />
                All at <span className="text-yellow-300">CWTS</span>
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && !paginationLoading ? (
            <div className="flex justify-center items-center my-16">
              <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-600 border-t-transparent"></div>
              </div>
              <p className="ml-4 text-gray-600 text-lg font-medium">Loading blogs...</p>
            </div>
          ) : (
            <>
              {/* Popular Blogs Section */}
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">POPULAR BLOGS</h2>
                  <div className="ml-4 h-1 bg-blue-600 flex-grow rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mostLikedBlogs.slice(0, 4).map((blog) => (
                    <Link
                      to={`/blog/${blog._id}`}
                      key={blog._id}
                      className="flex bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition transform duration-300"
                    >
                      {/* Image */}
                      <div className="flex-shrink-0 w-1/3">
                        <img
                          src={blog.imageCloudUrl || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full mb-3">
                            {blog.category}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">{blog.title}</h3>
                        </div>

                        <div className="flex items-center mt-4">
                          <img
                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                            src={blog.author.profilePicture || "/placeholder.svg"}
                            alt={blog.author.name}
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{blog.author.name}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Banner Ad Section */}
              <div className="my-12 flex justify-center">
                <div className="relative w-full max-w-5xl overflow-hidden rounded-xl shadow-lg">
                  <img
                    src="/freepik-export-20241219071211VKAR.jpeg"
                    alt="Technology banner"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center">
                    <div className="p-8 max-w-md">
                      <h3 className="text-3xl font-bold text-white mb-4">Discover the Future of Technology</h3>
                      <p className="text-blue-100 mb-6">Explore the latest trends and innovations in the tech world</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Authors Section */}
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">TOP AUTHORS</h2>
                  <div className="ml-4 h-1 bg-blue-600 flex-grow rounded-full"></div>
                </div>
                <TopAuthors />
              </section>

              {/* All Blogs Section */}
              <section id="all-blogs-section" className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">ALL BLOGS</h2>
                  <div className="ml-4 h-1 bg-blue-600 flex-grow rounded-full"></div>
                </div>

                {/* Pagination info */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredBlogs.length}</span> results
                    {totalPages > 0 && (
                      <>
                        {" "}
                        - Page <span className="font-medium">{currentPage + 1}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                      </>
                    )}
                  </div>

                  {/* Page Size Selector */}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Items per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        const newSize = Number(e.target.value)
                        setPageSize(newSize)
                        setCurrentPage(0) // Reset to first page when changing page size
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </div>
                </div>

                {/* Blog list with loading overlay */}
                <div className="relative">
                  {paginationLoading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full absolute border-4 border-gray-200"></div>
                          <div className="w-8 h-8 rounded-full animate-spin absolute border-4 border-blue-600 border-t-transparent"></div>
                        </div>
                        <p className="ml-3 text-gray-600 font-medium">Loading page {currentPage + 1}...</p>
                      </div>
                    </div>
                  )}
                  <BlogList blogs={filteredBlogs} setBlogs={setBlogs} layout="grid" />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                        Showing page {currentPage + 1} of {totalPages}
                      </div>

                      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                        {/* First page button */}
                        <button
                          onClick={() => handlePageChange(0)}
                          disabled={currentPage === 0}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                            currentPage === 0
                              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          aria-label="Go to first page"
                        >
                          <ChevronsLeft className="h-5 w-5" />
                        </button>

                        {/* Previous button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                          className={`relative inline-flex items-center px-2 py-2 border ${
                            currentPage === 0
                              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Page numbers */}
                        {getVisiblePageRange().map((page, index) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700"
                              >
                                ...
                              </span>
                            )
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                page === currentPage
                                  ? "z-10 bg-blue-600 border-blue-600 text-white"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                              aria-current={page === currentPage ? "page" : undefined}
                            >
                              {page + 1}
                            </button>
                          )
                        })}

                        {/* Next button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages - 1}
                          className={`relative inline-flex items-center px-2 py-2 border ${
                            currentPage >= totalPages - 1
                              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Last page button */}
                        <button
                          onClick={() => handlePageChange(totalPages - 1)}
                          disabled={currentPage >= totalPages - 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                            currentPage >= totalPages - 1
                              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          aria-label="Go to last page"
                        >
                          <ChevronsRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>

                    {/* Jump to page (on larger screens) */}
                    <div className="hidden sm:flex justify-center mt-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Jump to page:</span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage + 1}
                          onChange={(e) => {
                            const page = Number.parseInt(e.target.value, 10) - 1
                            if (!isNaN(page) && page >= 0 && page < totalPages) {
                              handlePageChange(page)
                            }
                          }}
                          className="border border-gray-300 rounded w-16 px-2 py-1 text-sm"
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[type="number"]')
                            const page = Number.parseInt(input.value, 10) - 1
                            if (!isNaN(page) && page >= 0 && page < totalPages) {
                              handlePageChange(page)
                            }
                          }}
                          className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Go
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Homepage
