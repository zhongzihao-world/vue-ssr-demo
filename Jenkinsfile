node {
  node_image = "node:latest"
}
pipeline {
  agent any
  environment {
    project_name = "blog-frontend"
    tar_file_name = "${project_name}-${GIT_BRANCH}.tar.gz"

    commit_user = sh(returnStdout: true, script: "git log --pretty='%an' -1").trim()
    commit_time = sh(returnStdout: true, script: "git log --pretty='%cd' -1").trim()
    commit_msg = sh(returnStdout: true, script: "git log --pretty='%s' -1").trim()
    commit_hash = sh(returnStdout: true, script: "git log --pretty='%h' -1").trim()
  }
  stages {
    stage("check params"){
      steps{
				echo "-----------------------------------------------"
        echo "项目名: ${project_name}"
        echo "项目分支: ${GIT_BRANCH}"
				echo "dist文件名: ${tar_file_name}"
				echo "项目工作目录：${BUILD_URL}"
        echo "-----------------------------------------------"
        echo "commit_user is: ${commit_user}"
        echo "commit_time is: ${commit_time}"
        echo "commit_msg is: ${commit_msg}"
        echo "commit_hash is: ${commit_hash}"
        echo "-----------------------------------------------"
        sh "docker images"
        echo "-----------------------------------------------"
      }
    }
    stage("install dependencies And build"){
      steps{
        withDockerContainer(image: "${node_image}") {
          sh "npm install -g cnpm --registry=https://registry.npm.taobao.org"
          sh "cnpm install"
          sh "npm run build:linux"
          sh "ls"
        }
      }
    }
    stage("tar dist And archiveArtifacts"){
      steps {
        echo "-------------------压缩dist----------------------------"
        sh "tar zcvf ${tar_file_name}  ./dist"
        archiveArtifacts artifacts: "${tar_file_name}", fingerprint: true, onlyIfSuccessful: true
        echo "-------------------归档完成----------------------------"
      }
    }
  }
  post {
    always {
			echo "-------------------开始发送邮件----------------------------"
      echo "-------------------邮件发送成功----------------------------"
    }
  }
}
